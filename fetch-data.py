#!/usr/bin/env python3
"""demo4 真实数据抓取：上证指数行情/分时 + 东财行业排名 + 板块资金流(今日/5日)
数据源与代码取自 Vibe-Research/a-stock-data SKILL.md V3.7.1（腾讯不封IP；东财走限流）"""
import json, time, random, urllib.request
from pathlib import Path

OUT = Path(__file__).parent / "demo4-data.json"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

# ── 东财防封：串行限流（≥1s+抖动），仅 3 次请求 ─────────────────────
_em_last = [0.0]
def em_get(url, params=None, timeout=15):
    import requests
    wait = 1.0 - (time.time() - _em_last[0])
    if wait > 0:
        time.sleep(wait + random.uniform(0.1, 0.5))
    try:
        r = requests.get(url, params=params, headers={"User-Agent": UA}, timeout=timeout)
        return r.json()
    finally:
        _em_last[0] = time.time()

# ── 1. 腾讯实时行情（SKILL §1.2 tencent_quote 精简版，指数走显式前缀）──
def tencent_quote(codes):
    url = "https://qt.gtimg.cn/q=" + ",".join(codes)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    data = urllib.request.urlopen(req, timeout=10).read().decode("gbk")
    result = {}
    for line in data.strip().split(";"):
        if not line.strip() or "=" not in line or '"' not in line:
            continue
        key = line.split("=")[0].split("_")[-1]
        v = line.split('"')[1].split("~")
        if len(v) < 53:
            continue
        result[key] = {
            "name": v[1], "price": float(v[3] or 0), "last_close": float(v[4] or 0),
            "open": float(v[5] or 0), "change_amt": float(v[31] or 0),
            "change_pct": float(v[32] or 0), "high": float(v[33] or 0), "low": float(v[34] or 0),
            "amount_wan": float(v[37] or 0), "time": v[30],
        }
    return result

# ── 2. 腾讯 m5 分钟K（ifzq mkline 官方代理域名，≤320 根）─────────────
def tencent_m5(code="sh000001"):
    import requests
    url = f"https://proxy.finance.qq.com/ifzqgtimg/appstock/app/kline/mkline?param={code},m5,,320"
    r = requests.get(url, headers={"User-Agent": UA, "Referer": "https://gu.qq.com/"}, timeout=12)
    d = r.json()
    bars = d["data"][code]["m5"]          # [["YYYYMMDDHHMM",o,c,h,l,vol,...],...] 升序
    last_day = bars[-1][0][:8]            # 最近交易日
    today = [b for b in bars if b[0][:8] == last_day]
    return {"date": last_day,
            "points": [{"t": b[0][8:10] + ":" + b[0][10:12], "c": float(b[2])} for b in today]}

# ── 3. 东财行业排名（SKILL §3.7 industry_comparison，pz=100）──────────
def industry_ranking():
    d = em_get("https://push2.eastmoney.com/api/qt/clist/get", {
        "pn": "1", "pz": "100", "po": "1", "np": "1", "fltt": "2", "invt": "2",
        "fid": "f3", "fs": "m:90+t:2",
        "fields": "f3,f12,f14,f104,f105,f128,f136,f140,f141",
    })
    items = (d.get("data") or {}).get("diff") or []
    rows = []
    for it in items:
        rows.append({
            "name": it.get("f14", ""), "code": it.get("f12", ""),
            "change_pct": it.get("f3", 0),
            "up_count": it.get("f104", 0), "down_count": it.get("f105", 0),
            "leader": it.get("f140", ""), "leader_change": it.get("f136", 0),
        })
    return rows

# ── 4. 板块资金流（SKILL §3.8 board_fund_flow，今日+5日）─────────────
_BOARD_PERIOD = {"today": ("f62", "f62", "f184", "f3", "f204", ["f66", "f72", "f78", "f84"]),
                 "5d":    ("f164", "f164", "f165", "f109", "f257", [])}
def board_flow(period="today", top_n=30):
    fid, f_main, f_pct, f_chg, f_leader, extra = _BOARD_PERIOD[period]
    fields = ",".join(dict.fromkeys(["f12", "f14", f_chg, f_main, f_pct, f_leader] + extra))
    d = em_get("https://push2.eastmoney.com/api/qt/clist/get", {
        "pn": "1", "pz": "200", "po": "1", "np": "1", "fltt": "2", "invt": "2",
        "fid": fid, "fs": "m:90+t:2", "fields": fields,
    })
    items = (d.get("data") or {}).get("diff") or []
    rows = []
    for it in items[:top_n]:
        row = {"name": it.get("f14", ""), "change_pct": it.get(f_chg, 0),
               "main_net": it.get(f_main, 0), "main_pct": it.get(f_pct, 0),
               "leader": it.get(f_leader, "")}
        if period == "today":
            row["super_net"] = it.get("f66", 0); row["large_net"] = it.get("f72", 0)
        rows.append(row)
    return rows

# ── 组装 ─────────────────────────────────────────────────────────────
def main():
    q = tencent_quote(["sh000001"])["sh000001"]
    m5 = tencent_m5("sh000001")
    industries = industry_ranking()
    flow_today = board_flow("today")
    flow_5d = board_flow("5d")
    up = sum(r["up_count"] for r in industries if r["up_count"] != "-")
    down = sum(r["down_count"] for r in industries if r["down_count"] != "-")
    out = {
        "fetched_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "index": {**q, "amount_yi": round(q["amount_wan"] / 1e4, 1)},
        "intraday": m5,
        "breadth": {"up": up, "down": down, "industries": len(industries)},
        "industries": industries,
        "flow_today": flow_today,
        "flow_5d": flow_5d,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"✅ {OUT}")
    print(f"指数 {q['name']} {q['price']} ({q['change_pct']:+.2f}%) 行情时间 {q['time']}")
    print(f"分时 {m5['date']} {len(m5['points'])} 根m5")
    print(f"行业 {len(industries)} 个 · 涨跌家数 {up}/{down}")
    print("主力净流入 TOP5:", [(r['name'], round(r['main_net']/1e8, 2)) for r in flow_today[:5]])

if __name__ == "__main__":
    main()
