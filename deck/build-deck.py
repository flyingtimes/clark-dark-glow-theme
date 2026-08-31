#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-deck.py — 从单一规格生成 clark 暗黑辉光主题教学 deck
产出:
  composition/index.html  — HyperFrames 幻灯 composition（40 场景 + JSON island + 每场景 timeline）
  index.html              — 可直接打开的 slideshow wrapper（island 同源复制，绝不手工同步）
规格即数据：改 SLIDES 列表后重跑本脚本即可再生。
"""
import json, os

D = 8            # 每页时长（秒）
W, H = 1920, 1080

# ─────────────────────────────────────────────────────────────
# 素材（media-use 注册产物，顺序即编号）
IMG = {
    "hero": ".media/images/image_001.png",
    "dial": ".media/images/image_002.png",
    "glowcards": ".media/images/image_003.png",
    "forecast": ".media/images/image_004.png",
    "cal_broken": ".media/images/image_011.png",
    "cal_fixed": ".media/images/image_012.png",
    "datatable": ".media/images/image_007.png",
    "demo6": ".media/images/image_008.png",
}

# ─────────────────────────────────────────────────────────────
CSS = """
*{margin:0;padding:0;box-sizing:border-box}
@font-face{font-family:'PingFang SC';src:local('PingFang SC')}
@font-face{font-family:'Hiragino Sans GB';src:local('Hiragino Sans GB')}
@font-face{font-family:'JetBrains Mono';src:local('JetBrains Mono'),local('JetBrainsMono-Regular')}
html,body{background:#060608}
body{font-family:'PingFang SC','Hiragino Sans GB',system-ui,sans-serif;color:#e8e8ee}
.mono{font-family:'JetBrains Mono','PingFang SC',monospace}
.scene-frame{position:absolute;top:0;left:0;width:%(W)spx;height:%(H)spx;overflow:hidden;background:
  radial-gradient(1100px 620px at 82%% -8%%,rgba(242,169,60,.075),transparent 60%%),
  radial-gradient(900px 560px at -6%% 106%%,rgba(143,123,245,.06),transparent 60%%),#0a0a0c}
.scene-frame::before{content:'';position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
  background-size:96px 96px}
.slide{position:absolute;inset:0;padding:88px 108px;display:flex;flex-direction:column}
.kicker{font-family:'JetBrains Mono',monospace;font-size:26px;letter-spacing:.32em;
  color:#f2a93c;text-transform:uppercase;margin-bottom:26px}
.kicker .dim{color:#8b8b96}
h1.head{font-size:68px;font-weight:700;line-height:1.22;letter-spacing:.01em;max-width:1560px}
h1.head .hl{color:#f2a93c;text-shadow:0 0 26px rgba(242,169,60,.35)}
.lede{font-size:38px;color:#9a9aa5;line-height:1.65;margin-top:22px;max-width:1500px}
.lede b{color:#e8e8ee;font-weight:600}
.body-row{display:flex;gap:56px;margin-top:52px;flex:1;min-height:0;align-items:stretch}
.col{flex:1;min-width:0;display:flex;flex-direction:column;gap:24px;justify-content:center}
.shot-frame{border:1px solid #26262e;border-radius:16px;background:#0d0d11;padding:12px;
  box-shadow:0 0 60px -22px rgba(242,169,60,.5);display:flex;align-items:center;justify-content:center;
  overflow:hidden;align-self:center;max-width:100%%}
.shot-frame img{max-width:100%%;max-height:100%%;object-fit:contain;border-radius:8px;display:block}
.cap{font-family:'JetBrains Mono',monospace;font-size:24px;color:#8b8b96;margin-top:14px;text-align:center}
.card{border:1px solid #26262e;border-radius:14px;background:rgba(16,16,20,.82);padding:30px 34px;
  box-shadow:0 0 44px -20px rgba(242,169,60,.28)}
.card .ct{font-size:34px;font-weight:600;margin-bottom:12px}
.card .cd{font-size:29px;color:#9a9aa5;line-height:1.6}
.card .cd b{color:#e8e8ee;font-weight:600}
.quote{border-left:4px solid #f2a93c;border-radius:6px 14px 14px 6px;
  background:linear-gradient(90deg,rgba(242,169,60,.09),rgba(16,16,20,.9) 55%%);
  padding:34px 42px;box-shadow:0 0 46px -18px rgba(242,169,60,.45)}
.quote .qt{font-size:34px;line-height:1.72;color:#e8e8ee}
.quote .qt b{color:#f2a93c;font-weight:600}
.quote .qs{font-family:'JetBrains Mono',monospace;font-size:22px;color:#8b8b96;margin-top:16px}
.li{display:flex;gap:24px;align-items:flex-start;border:1px solid #23232b;border-radius:12px;
  background:rgba(16,16,20,.7);padding:24px 30px}
.li .n{font-family:'JetBrains Mono',monospace;font-size:30px;color:#f2a93c;min-width:64px;
  text-shadow:0 0 14px rgba(242,169,60,.5)}
.li .t{font-size:32px;line-height:1.55}
.li .t b{color:#f2a93c;font-weight:600}
.li .t span{color:#9a9aa5}
.frag{opacity:0;visibility:hidden}
.code{border:1px solid #26262e;border-radius:14px;background:#0b0b0f;padding:30px 36px;
  font-family:'JetBrains Mono',monospace;font-size:27px;line-height:1.78;color:#c9c9d4;
  box-shadow:0 0 46px -20px rgba(53,195,180,.35);white-space:pre;overflow:hidden}
.code .k{color:#f2a93c}.code .s{color:#46b37a}.code .c{color:#8b8b96}.code .f{color:#8f7bf5}
.stat{text-align:center;border:1px solid #26262e;border-radius:16px;padding:38px 26px;
  background:rgba(16,16,20,.85);box-shadow:0 0 50px -24px rgba(242,169,60,.4)}
.stat .v{font-family:'JetBrains Mono',monospace;font-size:76px;font-weight:700;color:#f2a93c;
  text-shadow:0 0 30px rgba(242,169,60,.45)}
.stat .k{font-size:28px;color:#9a9aa5;margin-top:12px}
.step{display:flex;align-items:center;gap:28px;border:1px solid #23232b;border-radius:12px;
  background:rgba(16,16,20,.72);padding:20px 30px}
.step .no{font-family:'JetBrains Mono',monospace;font-size:30px;color:#0a0a0c;background:#f2a93c;
  border-radius:8px;min-width:58px;height:58px;display:grid;place-items:center;font-weight:700;
  box-shadow:0 0 22px -4px rgba(242,169,60,.8)}
.step .t{font-size:32px}
.step .t b{font-weight:600}
.step .t span{color:#9a9aa5;font-size:28px}
.tl{display:flex;flex-direction:column;gap:13px}
.tl-row{display:flex;gap:22px;align-items:center;border-left:3px solid #26262e;padding:8px 0 8px 22px}
.tl-row .w{font-family:'JetBrains Mono',monospace;font-size:24px;color:#8b8b96;min-width:170px}
.tl-row .t{font-size:27px;line-height:1.45}
.tl-row .t b{color:#f2a93c;font-weight:600}
.tl-row .t span{color:#9a9aa5;font-size:24px}
.pill{display:inline-flex;align-items:center;gap:10px;border:1px solid #2c2c35;border-radius:999px;
  padding:10px 22px;font-family:'JetBrains Mono',monospace;font-size:25px;color:#c9c9d4;
  background:rgba(16,16,20,.75)}
.pill i{width:10px;height:10px;border-radius:50%%;display:inline-block}
.note-src{font-family:'JetBrains Mono',monospace;font-size:22px;color:#8b8b96}
.foot{position:absolute;bottom:40px;left:108px;right:108px;display:flex;justify-content:space-between;
  font-family:'JetBrains Mono',monospace;font-size:22px;color:#7d7d88}
.badge{display:inline-block;border:1px solid rgba(242,169,60,.45);border-radius:8px;padding:6px 16px;
  font-family:'JetBrains Mono',monospace;font-size:24px;color:#f2a93c;letter-spacing:.18em}
.vs{display:flex;gap:40px;align-items:stretch;justify-content:center}
.vs .shot-frame{flex:1}
.amb-dot{position:absolute;top:52px;right:112px;width:12px;height:12px;border-radius:50%%;
  background:#f2a93c;box-shadow:0 0 18px 2px rgba(242,169,60,.55);opacity:1}
.hot-hint{position:absolute;right:112px;bottom:96px;border:1px dashed rgba(242,169,60,.5);border-radius:12px;
  padding:16px 24px;font-size:26px;color:#f2a93c;background:rgba(10,10,12,.75)}
""" % {"W": W, "H": H}

# ─────────────────────────────────────────────────────────────
# 工具
def img(name, height=None, cap=None, flex=False):
    style = f"height:{height}px" if height else ("flex:1;min-height:0" if flex else "max-height:640px")
    c = f'<div class="cap">{cap}</div>' if cap else ""
    return f'<div class="shot-frame" style="{style}"><img src="{IMG[name]}" alt="{cap or name}"></div>{c}'

def frag(count):
    return count  # helper marker

SLIDES = []  # (id, kicker, title_html, body_html, nfrags, notes)

def S(sid, kicker, title, body, nfrags=0, notes=""):
    SLIDES.append(dict(id=sid, kicker=kicker, title=title, body=body, nfrags=nfrags, notes=notes))

# ═══════════════════════ 01 开场 ═══════════════════════
S("s-cover", "UI TEMPLATE METHODOLOGY",
  '',
  '''
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start">
    <div class="badge a-in" style="margin-bottom:38px">CLARK DARK GLOW THEME · 教学_deck</div>
    <h1 class="a-in" style="font-size:88px;font-weight:700;line-height:1.24;max-width:1620px">
      从「<span style="color:#f2a93c;text-shadow:0 0 30px rgba(242,169,60,.4)">看到一个喜欢的 UI</span>」<br>到「可复用的 UI 模板」
    </h1>
    <p class="a-in" style="font-size:40px;color:#9a9aa5;margin-top:34px">
      七步方法论 · 以 <b style="color:#e8e8ee">clark-dark-glow-theme</b> 两天构建过程为完整样例
    </p>
    <p class="a-in mono" style="font-size:26px;color:#8b8b96;margin-top:56px">
      你正在看的这套幻灯，本身就是该主题的活样例 —— 暗 · 辉光 · 五色 token · 等宽字
    </p>
  </div>
  ''', 0,
  "开场 30 秒：这套方法来自一次真实冲刺——一段 30 秒的股市视频，两天后变成 51 个组件的开源主题库。本 deck 的视觉就是主题本身。"),

S("s-origin", "00 · ORIGIN", 
  '<h1 class="head">这套方法论不是理论，是<span class="hl">一次真实的两天冲刺</span>提炼出来的</h1>',
  '''
  <div class="body-row">
    <div class="col">
      <div class="lede a-in">2026-08-30 02:05 第一次提交 → 08-31 08:21 审计清零。<br>
      一个「把视频风格变成组件库」的需求，走完了从灵感到开源的全部环节。</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:30px;margin-top:30px">
    <div class="stat frag" data-f>30 秒<div class="k">参考视频 · 唯一输入</div></div>
    <div class="stat frag" data-f>51 个<div class="k">shadcn 规范组件</div></div>
    <div class="stat frag">13 次<div class="k">git 提交 · 全程可溯</div></div>
    <div class="stat frag">60+40<div class="k">三轮审计问题 → 全部修复</div></div>
  </div>
  ''', 4,
  "强调真实性：不是编的教学案例，每一条指令、每一个 commit 都有记录。"),

S("s-map", "00 · MAP",
  '<h1 class="head">七步流水线：<span class="hl">前两步决定像不像，后五步决定能不能被复用</span></h1>',
  '''
  <div class="tl" style="margin-top:44px">
    <div class="step frag" data-f><div class="no">1</div><div class="t"><b>取证解构</b>　<span>ffmpeg 拆帧 · 量化提取设计 DNA · 精确计数</span></div></div>
    <div class="step frag" data-f><div class="no">2</div><div class="t"><b>Token 立规</b>　<span>CSS 变量收编一切 · STYLE-GUIDE 先行 · 一句话生成指令</span></div></div>
    <div class="step frag" data-f><div class="no">3</div><div class="t"><b>签名组件</b>　<span>1–2 个灵魂组件承载视觉身份，值得三轮打磨</span></div></div>
    <div class="step frag" data-f><div class="no">4</div><div class="t"><b>原语铺满</b>　<span>50 个常用组件同一套 token · copy-own-code</span></div></div>
    <div class="step frag" data-f><div class="no">5</div><div class="t"><b>三层验证页</b>　<span>画廊页 → 实战页(真实数据) → 合并样例页</span></div></div>
    <div class="step frag" data-f><div class="no">6</div><div class="t"><b>审计循环</b>　<span>「严苛视觉大师 20 问」× 轮次 · 组件缺陷优先</span></div></div>
    <div class="step frag" data-f><div class="no">7</div><div class="t"><b>防漂移加固</b>　<span>真源渲染管线 · Puppeteer 确定性验收</span></div></div>
  </div>
  ''', 7,
  "全 deck 的目录页。按一次 → 点亮一步。前两步是「像」，后五步是「可复用」——大多数自制模板死在后五步。"),

# ═══════════════════════ 02 方法论七步 ═══════════════════════
S("s-1a", "STEP 1 · 取证 A",
  '<h1 class="head">第 1 步·取证：<span class="hl">先固定证据，再谈审美</span></h1>',
  '''
  <div class="body-row">
    <div class="col" style="flex:1.15">
      <div class="code a-in"><span class="c"># 拆帧：把 30 秒视频变成可测量的静帧</span>
$ ffmpeg -i ref.mp4 -vf <span class="s">fps=2</span> frames/f_%03d.png

<span class="c"># 测量：从帧里读数字，不从记忆里读</span>
色值吸管 · 间距标尺 · 段数清点 · 角度测量</div>
      <div class="li a-in"><div class="n">!</div><div class="t"><b>凭印象复刻必然走样</b><span> —— 本项目 TheDial 打磨三轮才对齐视频，前两轮都输在「感觉差不多」</span></div></div>
    </div>
    <div class="col">
      <div class="card a-in"><div class="ct">要提取的四类证据</div>
        <div class="cd">① <b>色彩结构</b>（不是散色值，是体系）<br>② <b>视觉签名公式</b>（那个最抓眼的效果）<br>③ <b>精确计数</b>（段数/角度/周期）<br>④ <b>运动节奏</b>（速度曲线 · 停顿 · 循环）</div></div>
      <div class="card a-in"><div class="ct">网页类 UI 同理</div>
        <div class="cd">整页截图 → DevTools 取 computed style → 数值直接抄进 token</div></div>
    </div>
  </div>
  ''', 0,
  "核心观念：把「喜欢」翻译成可执行的数字。ffmpeg fps=2 拆帧是视频类输入的标准动作。"),

S("s-1b", "STEP 1 · 取证 B",
  '<h1 class="head">设计 DNA = <span class="hl">色彩结构 + 签名公式 + 精确计数</span></h1>',
  '''
  <div class="body-row">
    <div class="card frag" data-f style="flex:1"><div class="ct" style="color:#f2a93c">① 色彩 → token 体系</div>
      <div class="cd">吸管取 30 个色值 → 归纳出结构：<br><b>1 主色 amber + 4 扇区色 + 6 中性色</b><br><span class="mono" style="font-size:24px">--accent-amber:#f2a93c · --bg:#0a0a0c …</span><br>发现「体系」比收集「色值」重要 100 倍</div></div>
    <div class="card frag" data-f style="flex:1.25"><div class="ct" style="color:#35c3b4">② 签名公式（可参数化）</div>
      <div class="cd">辉光 = 一个公式吃任意主色：<br><span class="mono" style="font-size:24px;color:#46b37a">box-shadow: 0 0 <b>N</b>px −<b>M</b>px<br>&nbsp;&nbsp;color-mix(in oklab, <b>accent</b> 75%, transparent)</span><br>凡是「最抓眼的效果」，都要写成 <b>公式 + 参数</b>，而不是一次性 CSS</div></div>
    <div class="card frag" data-f style="flex:1"><div class="ct" style="color:#8f7bf5">③ 精确计数</div>
      <div class="cd">环形组件 <b>30 段</b>、每区 <b>6 段</b>、<b>60s</b> 一圈、拖尾 <b>32°</b><br>—— 全部来自逐帧测量，一个都不能「大概」</div></div>
  </div>
  ''', 3,
  "DNA 三件套。重点讲②：签名公式是模板可复用的最小单元——换一个主色，整套辉光跟着变。"),

S("s-1c", "STEP 1 · 取证 C",
  '<h1 class="head">精确计数样例：TheDial 的<span class="hl">每个数字都来自逐帧测量</span></h1>',
  f'''
  <div class="body-row">
    <div class="col" style="flex:1.5">{img("dial", flex=True, cap="最终成品 · 30 段圆角环扇形")}</div>
    <div class="col">
      <div class="li frag" data-f><div class="n">30</div><div class="t">刻度段总数<span> · 圆角环扇形，非圆点</span></div></div>
      <div class="li frag" data-f><div class="n">6+5</div><div class="t">每区 6 段 × 5 扇区<span> · 12 分钟/区</span></div></div>
      <div class="li frag" data-f><div class="n">32°</div><div class="t">拖尾光楔<span> · 渐变透明衰减</span></div></div>
      <div class="li frag" data-f><div class="n">1.6°</div><div class="t">刻度缝隙<span> · 加宽两次才对上</span></div></div>
      <div class="li frag" data-f><div class="n">60s</div><div class="t">一圈周期<span> · 三档 60/30/10s</span></div></div>
    </div>
  </div>
  ''', 5,
  "右侧五个数字就是「取证」的产出形态。对照左图逐一指出位置——这就是把审美变成参数。"),

S("s-2a", "STEP 2 · 立规 A",
  '<h1 class="head">第 2 步·立规：<span class="hl">先写规范，再写组件</span></h1>',
  '''
  <div class="body-row">
    <div class="col" style="flex:1.1">
      <div class="code a-in">clone-ui-test/
├─ components/ui/   <span class="c"># 51 个原语</span>
├─ components/      <span class="c"># 签名组件 glow-card / the-dial</span>
├─ hooks/           <span class="c"># use-focus-trap · use-disclose</span>
├─ lib/utils.ts     <span class="c"># cn() 类名合并</span>
├─ styles/          <span class="c"># token 全在这里</span>
└─ STYLE-GUIDE.md   <span class="c"># 契约 · agent 的入口</span></div>
    </div>
    <div class="col">
      <div class="li frag" data-f><div class="n">规1</div><div class="t"><b>所有颜色/阴影收进 CSS 变量</b><span> —— 一致性来自 token，不来自逐组件手调</span></div></div>
      <div class="li frag" data-f><div class="n">规2</div><div class="t"><b>STYLE-GUIDE 先于组件存在</b><span> —— 后面无论谁写（你/AI/未来会话）风格不散</span></div></div>
      <div class="li frag" data-f><div class="n">规3</div><div class="t"><b>规范里写「生成指令」</b><span> —— 让 agent 一句话就能调出整套风格</span></div></div>
    </div>
  </div>
  ''', 3,
  "目录骨架就是纪律。很多人上来就写组件，写到第 10 个时风格已经开始漂——因为规矩没有先立。"),

S("s-2b", "STEP 2 · 立规 B",
  '<h1 class="head">给 Agent 的契约：<span class="hl">一句话生成指令</span></h1>',
  '''
  <div class="body-row" style="flex-direction:column;gap:40px;justify-content:center">
    <div class="quote a-in">
      <div class="qt">「我要 <b>clark 的暗黑辉光主题</b>：五色 token、1px 渐变描边、
box-shadow 环境辉光、JetBrains Mono、copy-own-code。」</div>
      <div class="qs">STYLE-GUIDE.md 里固化的一句话 —— agent 读到即产出同风格页面</div>
    </div>
    <div style="display:flex;gap:26px">
      <div class="card frag" data-f style="flex:1"><div class="ct">STYLE-GUIDE 里必须有什么</div>
        <div class="cd">token 清单 · 辉光公式 · 字体栈 · 组件清单 · 布局密度 · 禁忌清单</div></div>
      <div class="card frag" data-f style="flex:1"><div class="ct">为什么这句话值钱</div>
        <div class="cd">它把「审美共识」压缩成<b>可传递的指令</b>——下次新会话、新 agent、新项目，风格零损耗</div></div>
      <div class="card frag" data-f style="flex:1"><div class="ct">真实回报</div>
        <div class="cd">demo5/example 两次「按规范重做全控件」请求，<b>一次生成 35+ 个组件全部同风格</b></div></div>
    </div>
  </div>
  ''', 3,
  "这一页是「模板」区别于「一套页面」的分水岭：模板必须能被一句话唤起。"),

S("s-3", "STEP 3 · 签名组件",
  '<h1 class="head">第 3 步·签名组件：<span class="hl">1–2 个灵魂组件承载视觉身份</span></h1>',
  f'''
  <div class="body-row">
    <div class="col" style="flex:1.35">{img("glowcards", flex=True, cap="GlowCard × NodeFlow —— 主题的视觉签名")}</div>
    <div class="col">
      <div class="card a-in"><div class="ct">为什么先做它们</div>
        <div class="cd">① 承载视觉身份，token 体系在做的过程中<b>被验证、被修正</b><br>
        ② 普通组件只是「换皮」，签名组件才是「设计」</div></div>
      <div class="card a-in"><div class="ct">判别法</div>
        <div class="cd">把参照 UI 截图拿给别人看，对方<b>印象最深的那 1–2 个元素</b>，就是签名组件</div></div>
      <div class="card a-in"><div class="ct">本项目的答案</div>
        <div class="cd"><b>GlowCard</b>（--glow 变量驱动环境辉光）<br>+ <b>TheDial</b>（30 段轮动盘）</div></div>
    </div>
  </div>
  ''', 0,
  "GlowCard 用 CSS 变量 --glow 参数化辉光，任何主色即插即用——签名组件本身也要是「模板化」的。"),

S("s-3b", "STEP 3 · 打磨",
  '<h1 class="head">签名组件值得<span class="hl">三轮逐帧打磨</span>——用户的真实迭代</h1>',
  '''
  <div style="display:flex;flex-direction:column;gap:26px;margin-top:46px">
    <div class="quote frag" data-f>
      <div class="qt">「the-dial.tsx 这个组件跟视频中的效果还有差距，<b>请仔细观察后改进</b>」</div>
      <div class="qs">第一轮 → 整块辉光高亮模型 · 环形标签联动 · 回写箭头</div>
    </div>
    <div class="quote frag" data-f>
      <div class="qt">「仔细对比…存在哪些效果差异（<b>静态＋动态</b>），并进行修复」</div>
      <div class="qs">第二轮 → 逐帧对比后重建几何：30 段圆角扇形 · 32° 拖尾 · 修复极坐标参数顺序反转</div>
    </div>
    <div class="quote frag" data-f>
      <div class="qt">「现在呈现的效果<b>就是我想要的</b>，但是转动速度太快了，而且不是匀速的…」</div>
      <div class="qs">第三轮 → 运动校准：60/30/10s 三档 · 修复二次方加速根因</div>
    </div>
  </div>
  ''', 3,
  "三轮的规律：先静态（几何/颜色）→ 再动态（速度/节奏）→ 最后物理（匀速性）。顺序反了会互相掩盖问题。"),

S("s-4", "STEP 4 · 原语",
  '<h1 class="head">第 4 步·原语铺满：<span class="hl">51 个组件、一套 token</span></h1>',
  '''
  <div class="lede a-in" style="margin-top:6px">按 shadcn 清单补齐常用组件，全部用同一套 token 重塑——常规组件只是「换皮」。</div>
  <div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:44px;max-width:1720px">
    <span class="pill frag" data-f><i style="background:#f2a93c"></i>button</span><span class="pill frag" data-f><i style="background:#f2a93c"></i>input</span><span class="pill frag" data-f><i style="background:#f2a93c"></i>select</span><span class="pill frag" data-f><i style="background:#f2a93c"></i>tabs</span><span class="pill frag" data-f><i style="background:#f2a93c"></i>dialog</span><span class="pill frag" data-f><i style="background:#f2a93c"></i>dropdown</span><span class="pill frag" data-f><i style="background:#8f7bf5"></i>popover</span><span class="pill frag" data-f><i style="background:#8f7bf5"></i>tooltip</span><span class="pill frag" data-f><i style="background:#8f7bf5"></i>hover-card</span><span class="pill frag" data-f><i style="background:#8f7bf5"></i>sheet · drawer</span><span class="pill frag" data-f><i style="background:#35c3b4"></i>data-table</span><span class="pill frag" data-f><i style="background:#35c3b4"></i>chart</span><span class="pill frag" data-f><i style="background:#35c3b4"></i>calendar · date-picker</span><span class="pill frag" data-f><i style="background:#35c3b4"></i>carousel</span><span class="pill frag" data-f><i style="background:#46b37a"></i>form · label</span><span class="pill frag" data-f><i style="background:#46b37a"></i>checkbox · switch · slider</span><span class="pill frag" data-f><i style="background:#46b37a"></i>progress · skeleton · spinner</span><span class="pill frag" data-f><i style="background:#e5604c"></i>sonner · kbd · avatar · badge</span><span class="pill frag" data-f><i style="background:#e5604c"></i>accordion · collapsible</span><span class="pill frag" data-f><i style="background:#e5604c"></i>command ⌘K · pagination</span><span class="pill frag" data-f><i style="background:#9a9aa5"></i>…51 primitives in total</span>
  </div>
  <div class="lede frag" data-f style="margin-top:40px">验收标准只有一条：<b>任何两个组件摆在一起，都像同一个家族</b>。</div>
  ''', 21,
  "药丸逐个点亮（快节奏连点）。这一步没有创造力，只有纪律——token 用了就统一，没用就散架。"),

S("s-4b", "STEP 4 · 哲学",
  '<h1 class="head">copy-own-code：<span class="hl">源码进仓库，AI 才能直接改</span></h1>',
  '''
  <div class="body-row">
    <div class="quote a-in" style="flex:1.1">
      <div class="qt">「什么时候用 <b>copy-own-code</b> 的组件工程方式？」</div>
      <div class="qs">用户在第一天的提问 —— 答案成为整个项目的地基</div>
    </div>
    <div class="col">
      <div class="li frag" data-f><div class="n">✓</div><div class="t"><b>零黑盒依赖</b><span> —— 组件源码物理上在你仓库里</span></div></div>
      <div class="li frag" data-f><div class="n">✓</div><div class="t"><b>bug 自己修</b><span> —— 不用等上游发版（本项目真修过 chart.tsx 缺 import）</span></div></div>
      <div class="li frag" data-f><div class="n">✓</div><div class="t"><b>AI 可直接编辑</b><span> —— agent 改的就是你看到的，没有编译产物屏障</span></div></div>
      <div class="li frag" data-f><div class="n">✓</div><div class="t"><b>审计可直达源码</b><span> —— 三轮审计改的全是组件源文件，改一次全局受益</span></div></div>
    </div>
  </div>
  ''', 4,
  "shadcn 的核心哲学：不是 npm 依赖，是把代码复制给你。对「AI 时代的 UI 模板」这是决定性优势。"),

S("s-5", "STEP 5 · 验证页",
  '<h1 class="head">第 5 步·三层验证页：<span class="hl">画廊 → 实战 → 合并样例</span></h1>',
  '''
  <div class="body-row">
    <div class="card frag" data-f style="flex:1"><div class="ct" style="color:#f2a93c">① 画廊页</div>
      <div class="cd">所有组件平铺（demo2/demo3）<br><b>验证个体</b>：每个组件单独看对不对</div></div>
    <div class="card frag" data-f style="flex:1"><div class="ct" style="color:#35c3b4">② 实战页</div>
      <div class="cd">套进真实内容（demo4 行情终端）<br><b>验证组合</b>：组件摆在一起协不协调、密度对不对</div></div>
    <div class="card frag" data-f style="flex:1"><div class="ct" style="color:#8f7bf5">③ 合并样例页</div>
      <div class="cd">完整主题展示（demo/example.html）<br><b>验证复用</b>：日后套模板的直接参照物</div></div>
  </div>
  <div class="lede frag" data-f style="margin-top:44px">跳过第②层是常见错误：<b>组件各自漂亮、组合起来灾难</b>——密度、留白、层级问题只在真实内容里暴露。</div>
  ''', 4,
  "三层缺一不可。画廊页骗过很多人：单看都好，一进真实页面就崩。"),

S("s-5b", "STEP 5 · 真实数据",
  '<h1 class="head">实战页必须接<span class="hl">真实数据</span>——假数据藏不住的问题它会全暴露</h1>',
  f'''
  <div class="body-row">
    <div class="col" style="flex:1.5">{img("hero", flex=True, cap="REAL 徽章 = 真实行情 · 上证指数 3,952.18")}</div>
    <div class="col">
      <div class="li frag" data-f><div class="n">1</div><div class="t"><b>重复标签现形</b><span> —— 「上证指数 上证指数」双写，真实数据一接入立刻暴露</span></div></div>
      <div class="li frag" data-f><div class="n">2</div><div class="t"><b>格式不一致现形</b><span> —— 3,952.18 vs 3970.31，千分位只有真数字才看得出</span></div></div>
      <div class="li frag" data-f><div class="n">3</div><div class="t"><b>空态/极值现形</b><span> —— 0 值、负值、超长名称，mock 永远造不全</span></div></div>
      <div class="li frag" data-f><div class="n">4</div><div class="t"><b>降级路径现形</b><span> —— fetch 失败回退 MOCK + REAL/MOCK 徽章，健壮性需求自己浮出来</span></div></div>
    </div>
  </div>
  ''', 4,
  "真实数据是免费的最强测试集。这一页四类问题全部真实发生过。"),

S("s-6", "STEP 6 · 审计",
  '<h1 class="head">第 6 步·审计循环：请一位<span class="hl">「严苛的视觉前端大师」</span></h1>',
  '''
  <div style="display:flex;flex-direction:column;gap:30px;margin-top:42px;max-width:1660px">
    <div class="quote a-in">
      <div class="qt">「请你扮演一个<b>严苛的视觉前端大师</b>的角色，充分利用你的视觉功能，
给这个页面找出来 <b>20 个</b>要改进的地方，<b>包含理据</b>。
要从<b>用户体验角度</b>说出问题来，<b>最严重的问题排在前面</b>。」</div>
      <div class="qs">原封不动的用户指令 —— 这句话本身就是可复用的 prompt 模板</div>
    </div>
    <div style="display:flex;gap:26px">
      <div class="pill frag" data-f><i style="background:#f2a93c"></i>固定数量 20 条 · 防止敷衍</div>
      <div class="pill frag" data-f><i style="background:#35c3b4"></i>每条必须附 UX 理据</div>
      <div class="pill frag" data-f><i style="background:#8f7bf5"></i>按严重度排序</div>
      <div class="pill frag" data-f><i style="background:#46b37a"></i>修复后再来一轮</div>
    </div>
  </div>
  ''', 4,
  "质量引擎。这句 prompt 值得原样抄走：数量锚点防敷衍、理据强制防主观、排序强制防和稀泥。"),

S("s-6b", "STEP 6 · 审计解剖",
  '<h1 class="head">一条合格的审计意见长什么样：以<span class="hl">「白表头按钮」</span>为例</h1>',
  '''
  <div class="body-row" style="flex-direction:column;gap:26px;justify-content:center">
    <div class="li frag" data-f><div class="n" style="color:#e5604c">P0</div><div class="t"><b>现象</b><span> —— 数据表 4 个排序表头渲染成白底黑字原生按钮，深色页面上像「页面坏了」</span></div></div>
    <div class="li frag" data-f><div class="n" style="color:#f2a93c">理据</div><div class="t"><b>用户体验链</b><span> —— 视觉破裂 → 用户怀疑可靠性 → 金融数据页的信任归零；且 4 处同时出现 = 系统性缺陷非孤例</span></div></div>
    <div class="li frag" data-f><div class="n" style="color:#35c3b4">根因</div><div class="t"><b>同类归并</b><span> —— 面包屑默认蓝链接、系统蓝焦点环同源：页面拼装丢失 base reset 段 → 一次修复消三处</span></div></div>
    <div class="li frag" data-f><div class="n" style="color:#46b37a">验证</div><div class="t"><b>可机读判据</b><span> —— getComputedStyle(th button).backgroundColor === 'rgba(0,0,0,0)' 才算修完</span></div></div>
  </div>
  ''', 4,
  "四段式：现象→理据→根因→可验证判据。「不好看」不是审计意见，「为什么伤用户体验+怎么算修好」才是。"),

S("s-7", "STEP 7 · 防漂移",
  '<h1 class="head">第 7 步·防漂移：<span class="hl">真源管线</span> + 确定性验收</h1>',
  f'''
  <div class="body-row">
    <div class="col" style="flex:1.5">{img("demo6", flex=True, cap="demo6 · 浏览器内 fetch 真实 TSX → Babel → React 挂载")}</div>
    <div class="col">
      <div class="card a-in"><div class="ct">镜像漂移：4 起真实事故</div>
        <div class="cd">toast 通知 · 轮播箭头 · 折叠面板 · chart 数值<br>
        手写 HTML 演示页悄悄落后于组件真源</div></div>
      <div class="card a-in"><div class="ct">解法：让浏览器渲染真源</div>
        <div class="cd">demo6 零构建管线直接渲染 components/ui 的 tsx 真源<br>
        <b>组件行为唯一以它为准</b>，手写镜像降级为快照</div></div>
      <div class="card a-in"><div class="ct">首跑即回本</div>
        <div class="cd">管线第一次运行就捕获 chart.tsx 缺失 cn import —— 手写镜像永远发现不了</div></div>
    </div>
  </div>
  ''', 0,
  "模板会腐化的本质：演示页与组件源是两份真相。真源管线让「看到的=源码的」。"),

S("s-7b", "STEP 7 · 确定性",
  '<h1 class="head">肉眼会骗人，<span class="hl">DOM 探针不会</span></h1>',
  '''
  <div class="body-row">
    <div class="col" style="flex:1.3">
      <div class="code a-in"><span class="c">// Puppeteer 验收：不是截图看看，是断言</span>
const r = await page.evaluate(() => ({
  <span class="f">badge</span>: g(<span class="s">'src-badge'</span>).textContent.slice(0,4),
  <span class="f">arrow</span>: getComputedStyle(
    document.querySelector(<span class="s">'.car-arrow'</span>)).opacity,
  <span class="f">leak</span>:  body.offsetHeight <span class="k">===</span> 0,  <span class="c">// 折叠零泄漏</span>
}));
assert(r.badge <span class="k">===</span> <span class="s">'REAL'</span>);  <span class="c">// 不符即失败</span></div>
    </div>
    <div class="col">
      <div class="li frag" data-f><div class="n">1</div><div class="t"><b>截图给人看，探针给机器判</b><span> —— computed style / rect / children 数量全是硬判据</span></div></div>
      <div class="li frag" data-f><div class="n">2</div><div class="t"><b>交互也要探针</b><span> —— Esc 关闭、Tab 焦点陷阱、粘贴进 OTP，全部脚本化点击验证</span></div></div>
      <div class="li frag" data-f><div class="n">3</div><div class="t"><b>零页面错误是底线</b><span> —— pageerror / console error 计数为 0 才算过</span></div></div>
    </div>
  </div>
  ''', 3,
  "40 项修复零回归的秘密就在这页：每项修复都配了机读判据。"),

# ═══════════════════════ 03 实战十二阶段 ═══════════════════════
S("s-case", "CASE · TIMELINE",
  '<h1 class="head">实战复盘：<span class="hl">两天 · 12 个阶段 · 13 次 commit</span></h1>',
  '''
  <div class="tl" style="margin-top:38px">
    <div class="tl-row frag" data-f><div class="w">08-30 02:05</div><div class="t"><b>阶段 1–2</b> 视频进来 → shadcn 骨架 + 首批组件<span> · 0992b78 · 84714fa</span></div></div>
    <div class="tl-row frag" data-f><div class="w">08-30 03:00</div><div class="t"><b>阶段 3</b> TheDial 逐帧对齐两轮<span> · f0167aa</span></div></div>
    <div class="tl-row frag" data-f><div class="w">08-30 09:08</div><div class="t"><b>阶段 4–5</b> 51 原语 + demo5 + 第一轮审计 20 条<span> · 810981d · 5907ab9 · e41f51c</span></div></div>
    <div class="tl-row frag" data-f><div class="w">08-30 09:44</div><div class="t"><b>阶段 6–7</b> 匀速三档 + 真实数据接入<span> · 65bee53 · 91c0e15 · b8a0fd5</span></div></div>
    <div class="tl-row frag" data-f><div class="w">08-30 12:06</div><div class="t"><b>阶段 8</b> Puppeteer 确定性录片<span> · 083b20a</span></div></div>
    <div class="tl-row frag" data-f><div class="w">08-30 22:51</div><div class="t"><b>阶段 9</b> hooks 抽象 + demo6 真源管线<span> · 2c8e9f8</span></div></div>
    <div class="tl-row frag" data-f><div class="w">08-31 00:14</div><div class="t"><b>阶段 10–11</b> 合并 example + 两轮审计 40 项修复<span> · eb648db · 7b2a37d</span></div></div>
    <div class="tl-row frag" data-f><div class="w">08-31 全天</div><div class="t"><b>阶段 12</b> README 沉淀 + GitHub 开源<span> · 0ba954d</span></div></div>
  </div>
  ''', 8,
  "时间线页。注意节奏：凌晨做组件、上午接数据、下午审计、深夜抽象、次日合并开源——方法论各步在时间上真实分布。"),

S("s-st1", "阶段 01 · 起点指令",
  '<h1 class="head">一切始于一条<span class="hl">带视频附件的指令</span></h1>',
  '''
  <div style="display:flex;flex-direction:column;gap:34px;margin-top:44px;max-width:1680px">
    <div class="quote a-in">
      <div class="qt">「<b>[视频附件]</b> 如何使用 shadcn 的方式来构建类似附件视频呈现的 UI 效果？」</div>
      <div class="qs">2026-08-30 凌晨 · 会话第一条指令</div>
    </div>
    <div style="display:flex;gap:26px">
      <div class="card frag" data-f style="flex:1"><div class="ct">Agent 做了什么</div>
        <div class="cd">ffmpeg 拆帧 → 识别黑底/琥珀主色/环形转盘/辉光描边<br>→ 确立 shadcn 目录规范（cn() · cva · data-slot）</div></div>
      <div class="card frag" data-f style="flex:1"><div class="ct">关键决定</div>
        <div class="cd">没有急着「写个页面」，而是先回答：<br><b>用什么工程方式承载这个风格？</b></div></div>
      <div class="card frag" data-f style="flex:1"><div class="ct">可迁移点</div>
        <div class="cd">看到喜欢的东西，第一步永远是<b>固定证据</b>（拆帧/截图），<br>而不是直接开写</div></div>
    </div>
  </div>
  ''', 3,
  "回到第一因。这条指令里最重要的信号是「用 shadcn 的方式」——用户一开始就要的是体系，不是页面。"),

S("s-st2", "阶段 02 · 哲学之问",
  '<h1 class="head">第二天问出了<span class="hl">整个项目的地基</span></h1>',
  '''
  <div style="display:flex;flex-direction:column;gap:32px;margin-top:44px;max-width:1680px">
    <div class="quote a-in">
      <div class="qt">「帮我实现 <b>GlowCard 组件</b>，然后编制一个 demo 的 html 页面来渲染效果」</div>
      <div class="qs">指令 · 签名组件诞生</div>
    </div>
    <div class="quote a-in">
      <div class="qt">「什么时候用 <b>copy-own-code</b> 的组件工程方式？」</div>
      <div class="qs">指令 · 工程哲学确立 —— 源码进仓库 · 零黑盒 · AI 可直接编辑</div>
    </div>
    <div class="lede frag" data-f>GlowCard 以 <b class="mono" style="font-size:32px">--glow / --gi</b> 两个 CSS 变量驱动辉光 ——
    签名组件从第一天起就是<b>参数化的模板</b>，不是一次性样式。</div>
  </div>
  ''', 1,
  "两条指令定义了项目的两个轴：组件轴（GlowCard）和工程轴（copy-own-code）。"),

S("s-st3", "阶段 03 · 三轮对齐",
  '<h1 class="head">TheDial：把「感觉差不多」逼成<span class="hl">「参数全对」</span></h1>',
  '''
  <div class="body-row">
    <div class="col" style="flex:1.25">
      <div class="li frag" data-f><div class="n">R1</div><div class="t"><b>整块辉光模型</b><span> · 环形标签+点亮联动 · 区块中线色点 · 回写箭头</span></div></div>
      <div class="li frag" data-f><div class="n">R2</div><div class="t"><b>几何重建</b><span> · 30 段圆角环扇形（sectorPath 圆角计算）· 修复 polar 函数参数顺序反转</span></div></div>
      <div class="li frag" data-f><div class="n">R3</div><div class="t"><b>运动校准</b><span> · 32° 拖尾楔 · 数字与指针位置校正</span></div></div>
    </div>
    <div class="col" style="flex:1">
      <div class="card a-in"><div class="ct">教训</div>
        <div class="cd">「差距在哪」这种问题必须靠<b>逐帧并排对比</b>回答；<br>
        凭记忆改代码 = 改不完的盲盒</div></div>
      <div class="card a-in"><div class="ct">产出物</div>
        <div class="cd">一套带精确参数的 SVG 几何函数库：<br><span class="mono" style="font-size:23px">sectorPath(r0,r1,a0,a1,rc) · wedgePath() · P(r,deg)</span><br>
        —— 几何即数据，可复用可微调</div></div>
    </div>
  </div>
  ''', 3,
  "三轮对齐的真实轨迹。注意 R2 发现的极坐标参数反转 bug——只有逐帧对比才能暴露。"),

S("s-st4", "阶段 04 · 全控件统一",
  '<h1 class="head">一条指令生成 <span class="hl">35+ 个组件</span>：规范的力量</h1>',
  '''
  <div style="display:flex;flex-direction:column;gap:32px;margin-top:40px;max-width:1700px">
    <div class="quote a-in">
      <div class="qt">「为了形成统一风格的界面，请把其他常用控件用与刚才生成的组件<b>相同的样式方式</b>也一并改造，
从而形成完整的包含各类组件的新的设计。请最后<b>检查一次产品是否符合 shadcn 规范</b>。
并告诉我在 zcode 里面，<b>如何通过简单的指令</b>就生成此类风格的前端设计。」</div>
      <div class="qs">一条指令 · 三个要求：统一改造 + 规范自检 + 生成指令沉淀</div>
    </div>
    <div style="display:flex;gap:26px">
      <div class="card frag" data-f style="flex:1"><div class="ct">产出</div><div class="cd">组件清单 15 → <b>51 个</b><br>demo5 主页（Hero 辉光标题 · 组件拼贴 · ⌘K 面板）</div></div>
      <div class="card frag" data-f style="flex:1"><div class="ct">为什么能一次成</div><div class="cd">token 体系先立 → 组件只是「换皮」<br>没有 token，这条指令会产出 35 种风格</div></div>
      <div class="card frag" data-f style="flex:1"><div class="ct">指令的第三问最值钱</div><div class="cd">「如何用简单指令生成」逼出了 STYLE-GUIDE 的<br><b>一句话生成指令</b> —— 模板的激活码</div></div>
    </div>
  </div>
  ''', 3,
  "这是「模板」成立的瞬间：一次请求、35+ 组件、零风格漂移。顺便演示了怎么让 agent 反哺可复用资产。"),

S("s-st5", "阶段 05 · 第一轮审计",
  '<h1 class="head">第一轮审计：<span class="hl">20 条 → 分层修复</span></h1>',
  '''
  <div style="display:flex;flex-direction:column;gap:30px;margin-top:44px;max-width:1680px">
    <div class="quote a-in">
      <div class="qt">「请你扮演一个<b>严苛的视觉前端大师</b>…给这个 demo5 找出来 <b>20 个</b>要改进的地方，包含理据。<b>最严重的问题排在前面</b>。」</div>
    </div>
    <div style="display:flex;gap:26px;align-items:stretch">
      <div class="quote frag" data-f style="flex:1">
        <div class="qt" style="font-size:30px">「把这里面属于<b>组件本身</b>做的不好的问题先 fix 掉。」</div>
        <div class="qs">修复分层原则：组件缺陷会复制到每个使用处 → 先修组件</div>
      </div>
      <div class="quote frag" data-f style="flex:1">
        <div class="qt" style="font-size:30px">「继续清」</div>
        <div class="qs">两字指令 · 审计-修复循环继续，直到 20 条清零</div>
      </div>
    </div>
    <div class="lede frag" data-f>产出：<b>组件级修复</b>（焦点陷阱 · Sonner 上限 · DataTable 排序 · OTP 粘贴）+
    <b>页面级清零</b>（移动端汉堡导航 · 对比度 · reduced-motion）</div>
  </div>
  ''', 3,
  "注意用户的两个 follow-up：「先 fix 组件」定义了修复优先级，「继续清」定义了循环直到清零。"),

S("s-st6", "阶段 06 · 匀速三档",
  '<h1 class="head">「太快了，而且不是匀速的」——<span class="hl">一条指令揪出二次方加速 bug</span></h1>',
  '''
  <div class="body-row">
    <div class="col" style="flex:1.15">
      <div class="quote a-in">
        <div class="qt">「TheDial 现在呈现的效果<b>就是我想要的</b>，但是转动速度太快了，而且<b>不是匀速的</b>，
请按照 <b>60 秒、30 秒、10 秒</b>转一圈来设计」</div>
        <div class="qs">先确认「对」，再修「快」—— 需求颗粒度教科书</div>
      </div>
    </div>
    <div class="col" style="flex:1">
      <div class="card frag" data-f><div class="ct" style="color:#e5604c">根因：每帧回写 offset</div>
        <div class="cd">loop 里 <span class="mono" style="font-size:23px">offset = minute</span> 每帧执行 →<br>
        增量叠加自身 → <b>二次方加速</b>（越转越快）</div></div>
      <div class="card frag" data-f><div class="ct" style="color:#46b37a">修法：连续 rAF 时钟</div>
        <div class="cd">offset 只在 scrub/换档时重锚定，<br>render 由 <span class="mono" style="font-size:23px">now − start</span> 驱动 → 严格匀速</div></div>
      <div class="card frag" data-f><div class="ct">教训</div>
        <div class="cd">运动类需求要写<b>可观测判据</b>：<br>任意 10s 采样，转角恒等于 60°</div></div>
    </div>
  </div>
  ''', 3,
  "用户描述症状（不匀速），agent 负责病理（每帧回写）。这类「体感 bug」只有可复现的数学描述才修得干净。"),

S("s-st7", "阶段 07 · 真实数据",
  '<h1 class="head">「把这个页面变成<span class="hl">真实数据</span>」—— 假到真的结构化迁移</h1>',
  '''
  <div class="body-row">
    <div class="col" style="flex:1.15">
      <div class="quote a-in">
        <div class="qt">「使用 <b>~/code/dsh-stock-analysis/Vibe-Research</b> 项目，抓取最新的数据，把这个页面变成真实数据」</div>
        <div class="qs">指令里连数据源都指定了 —— agent 只需管线化</div>
      </div>
      <div class="code a-in" style="margin-top:8px"><span class="c"># fetch-data.py · 双源抓取</span>
腾讯: 指数/分钟K  <span class="s">proxy.finance.qq.com</span>
东财: 行业资金流  <span class="s">push2.eastmoney.com</span>
      → demo4-data.json</div>
    </div>
    <div class="col">
      <div class="li frag" data-f><div class="n">1</div><div class="t"><b>语义重绑定</b><span> —— 轮动盘五区 = 当日主力净流入 TOP5 行业</span></div></div>
      <div class="li frag" data-f><div class="n">2</div><div class="t"><b>概率由公式推导</b><span> —— 净占比×2.2 + 涨幅×1.5，不再写死</span></div></div>
      <div class="li frag" data-f><div class="n">3</div><div class="t"><b>优雅降级</b><span> —— MOCK 立即渲染 → fetch 成功整体替换 · REAL/MOCK 徽章</span></div></div>
    </div>
  </div>
  ''', 3,
  "接真数据不是换数字，是重写「数据→视觉」的语义映射。MOCK 先渲染保证离线也能演示。"),

S("s-st8", "阶段 08 · 确定性录片",
  '<h1 class="head">录屏卡顿 → <span class="hl">Puppeteer 逐帧渲染</span>：放弃模仿人手</h1>',
  '''
  <div style="display:flex;flex-direction:column;gap:32px;margin-top:42px;max-width:1680px">
    <div class="quote a-in">
      <div class="qt">「帮我录制…从页面顶端<b>缓缓下拉到底部，总共 30 秒</b>」<br>
      →「我希望是<b>平滑的下拉</b>，现在有卡顿的感觉。另外屏幕录制需要<b>全屏幕、高清晰度</b>，现在清晰度太低。」</div>
      <div class="qs">两轮反馈 · 症状：卡顿 + 发软 —— 屏幕录制器的先天缺陷</div>
    </div>
    <div style="display:flex;gap:26px">
      <div class="card frag" data-f style="flex:1"><div class="ct">放弃录屏</div><div class="cd">IAB 内部采集面固定 → 输出放大发软；<br>实时滚动 → 帧间隔抖动 = 卡顿</div></div>
      <div class="card frag" data-f style="flex:1"><div class="ct">改为逐帧渲染</div><div class="cd">5120×2880 采集 → lanczos → 2560×1440@30fps<br><b>每帧滚动位置精确计算 = 绝对平滑</b></div></div>
      <div class="card frag" data-f style="flex:1"><div class="ct">方法论迁移</div><div class="cd">凡「人对着屏幕操作」的产出，皆可换成<br><b>确定性脚本</b>：截图 · 滚动 · 录片 · 验收</div></div>
    </div>
  </div>
  ''', 3,
  "一个通用心法：当「模拟人类操作」的质量不稳，就换成确定性程序。后面审计验证也是同一招。"),

S("s-st9", "阶段 09 · 完美组件库",
  '<h1 class="head">「聚焦组件设计缺陷…<span class="hl">形成完美组件库</span>」—— 抽象升级</h1>',
  '''
  <div class="body-row">
    <div class="col" style="flex:1.2">
      <div class="quote a-in">
        <div class="qt">「组件的使用也应该<b>尽量简单且可控</b>，在使用中不需要额外不必要编码和配置，
且<b>不容易踩坑</b>…对组件库进行<b>抽象、升级、修复</b>。」</div>
        <div class="qs">把「好用」翻译成工程语言：简单 · 可控 · 无坑</div>
      </div>
    </div>
    <div class="col">
      <div class="li frag" data-f><div class="n">A</div><div class="t"><b>抽 hooks 消灭复制粘贴</b><span> —— use-focus-trap 替换 5 处覆盖层重复逻辑 · use-disclose 统一弹层</span></div></div>
      <div class="li frag" data-f><div class="n">B</div><div class="t"><b>非受控 defaultOpen</b><span> —— 覆盖层组件不传 props 也能用</span></div></div>
      <div class="li frag" data-f><div class="n">C</div><div class="t"><b>demo6 真源管线</b><span> —— 浏览器内 fetch TSX → Babel → React，首跑即捕获 chart.tsx 缺 import</span></div></div>
    </div>
  </div>
  ''', 3,
  "「完美组件库」的可操作定义：用法简单（非受控可用）、行为统一（hooks 收敛）、可被验证（真源管线）。"),

S("s-st10", "阶段 10 · 资料库化",
  '<h1 class="head">从「一套页面」到<span class="hl">「agent 的前端组件资料库」</span></h1>',
  '''
  <div style="display:flex;flex-direction:column;gap:32px;margin-top:42px;max-width:1700px">
    <div class="quote a-in">
      <div class="qt">「把 demo4 和 demo5 <b>合并成一个完整的主题展示样例</b>，命名为 example，
更新和整理本项目所有文件，把本项目变成一个<b>适合类似 zcode 这类 agent 使用的前端组件资料库</b>，
后续我要用这个项目作为<b>前端风格的指引</b>。」</div>
      <div class="qs">项目定位的最终跃迁 —— 使用者从「人」变成「人 + agent」</div>
    </div>
    <div style="display:flex;gap:26px">
      <div class="card frag" data-f style="flex:1"><div class="ct">合并</div><div class="cd">example.html = 行情终端 × 全控件库<br>单一内联脚本 · 零重复声明</div></div>
      <div class="card frag" data-f style="flex:1"><div class="ct">整理</div><div class="cd">历史 demo → demo/ · 渲染器 → tools/<br>STYLE-GUIDe 更新入口指向</div></div>
      <div class="card frag" data-f style="flex:1"><div class="ct">为 agent 设计</div><div class="cd">三件套：<b>README（过程）· STYLE-GUIDE（契约）· example（参照）</b><br>agent 读契约 + 抄参照 = 风格零损耗</div></div>
    </div>
  </div>
  ''', 3,
  "「变成 agent 资料库」决定了整理方式：文档即接口、样例即真相、目录即语义。"),

S("s-st11", "阶段 11 · 再两轮",
  '<h1 class="head">两轮再审计 + <span class="hl">40 项修复</span>：质量是轮次堆出来的</h1>',
  '''
  <div style="display:flex;flex-direction:column;gap:30px;margin-top:42px;max-width:1680px">
    <div class="quote a-in">
      <div class="qt">「再给这个 example 页面找出来 <b>20 个</b>要改进的地方…」（× 2 轮）<br>
      「<b>修复问题</b>」</div>
      <div class="qs">累计 60 条审计 → 40 项修复 · Puppeteer 全量回归零报错</div>
    </div>
    <div style="display:flex;gap:24px;flex-wrap:wrap">
      <span class="pill frag" data-f><i style="background:#e5604c"></i>主题破裂 ×3</span>
      <span class="pill frag" data-f><i style="background:#f2a93c"></i>组件破损 ×4</span>
      <span class="pill frag" data-f><i style="background:#35c3b4"></i>数据呈现 ×5</span>
      <span class="pill frag" data-f><i style="background:#8f7bf5"></i>交互可发现 ×9</span>
      <span class="pill frag" data-f><i style="background:#46b37a"></i>展示密度 ×8</span>
      <span class="pill frag" data-f><i style="background:#9a9aa5"></i>文案语义 ×6</span>
    </div>
  </div>
  <div class="hot-hint frag" data-f>👉 点击此处深入：40 项修复全览</div>
  ''', 7,
  "右下角是本 deck 的交互热点（hotspot）——点击进入 40 项修复的分支细节页。审计要敢跑第二轮：新一轮永远能找到上一轮的盲区。"),

S("s-st12", "阶段 12 · 开源沉淀",
  '<h1 class="head">最后一步：<span class="hl">把过程变成公共资产</span></h1>',
  '''
  <div class="body-row" style="flex-direction:column;gap:34px;justify-content:center;max-width:1700px">
    <div style="display:flex;gap:26px">
      <div class="quote a-in" style="flex:1.2">
        <div class="qt" style="font-size:30px">「从会话日志中将用户所有指令摘录汇总到 readme 文件中，<b>展现这个 ui 的制作过程</b>」</div>
        <div class="qs">README = 指令 × 产出 × commit 的三列对照表</div>
      </div>
      <div class="quote a-in" style="flex:1">
        <div class="qt" style="font-size:30px">「帮我把这个项目提交到 github」「改成公有仓库」</div>
        <div class="qs">flyingtimes/clark-dark-glow-theme · PUBLIC</div>
      </div>
    </div>
    <div class="lede frag" data-f>沉淀的本质：<b>会话会丢，仓库不会</b>。指令摘录让下一次「照着做」成为可能——
    你现在上的这门课，就是从那个 README 长出来的。</div>
  </div>
  ''', 1,
  "闭环点题：这份教学 deck 本身就是「阶段 12 沉淀」的延伸产物。"),

S("s-quotes", "CASE · 指令形态学",
  '<h1 class="head">人是怎么指挥的：<span class="hl">指令的三种形态</span></h1>',
  '''
  <div class="body-row">
    <div class="card frag" data-f style="flex:1"><div class="ct" style="color:#f2a93c">目标型</div>
      <div class="cd">「帮我实现 GlowCard 组件，然后编制一个 demo 页面」<br><br>
      <b>特征</b>：名词 + 动词 + 验收载体<br><b>占比最高</b>，质量取决于 token 体系是否已立</div></div>
    <div class="card frag" data-f style="flex:1"><div class="ct" style="color:#8f7bf5">角色型</div>
      <div class="cd">「请你扮演一个严苛的视觉前端大师…」<br><br>
      <b>特征</b>：设定人格 + 量化产出（20 条/理据/排序）<br><b>杠杆最大</b>，一句顶十句普通反馈</div></div>
    <div class="card frag" data-f style="flex:1"><div class="ct" style="color:#35c3b4">校准型</div>
      <div class="cd">「太快了，而且不是匀速的」「继续清」「修复问题」<br><br>
      <b>特征</b>：极短，依赖上下文<br><b>价值在方向</b>——「先修组件」「静态动态分开」都是这类指令定义的</div></div>
  </div>
  <div class="lede frag" data-f style="margin-top:40px">启示：模板库建好后，<b>角色型指令是质量天花板</b>——把「严苛大师 20 问」存成你的常用 prompt。</div>
  ''', 4,
  "把 22 条真实指令做了形态学归纳。听众带走：三种指令各什么时候用。"),

# ═══════════════════════ 04 深入技法 ═══════════════════════
S("s-t-assert", "TECHNIQUE · 01",
  '<h1 class="head">技法一：批量修复必须<span class="hl">「失败即断言」</span></h1>',
  '''
  <div class="body-row">
    <div class="col" style="flex:1.25">
      <div class="code a-in"><span class="c"># 40 项修复的执行器：逐条断言，漏配即崩</span>
def rep(old, new, n=<span class="k">1</span>):
    c = s.count(old)
    <span class="k">assert</span> c == n, f<span class="s">'MATCH {c}!={n}: {old[:80]}'</span>
    <span class="k">return</span> s.replace(old, new)

rep(<span class="s">'📅 &lt;span id="dp-text"&gt;'</span>,
    <span class="s">'&lt;span id="dp-text"&gt;'</span>)  <span class="c"># emoji 移除</span></div>
    </div>
    <div class="col">
      <div class="li frag" data-f><div class="n">!</div><div class="t"><b>静默跳过 = 慢性毒药</b><span> —— 页面含 60 处关联值，一处漏改就是下一个 bug</span></div></div>
      <div class="li frag" data-f><div class="n">✓</div><div class="t"><b>改生成物用脚本，不手改</b><span> —— 时间线/schema/批量修复全是 transform 脚本</span></div></div>
      <div class="li frag" data-f><div class="n">✓</div><div class="t"><b>修复可重放</b><span> —— 脚本即文档：40 项怎么改的，代码自己会讲</span></div></div>
    </div>
  </div>
  ''', 3,
  "手改 40 处必错 3 处。断言式脚本让「漏改」从隐性 bug 变成立即崩溃。"),

S("s-t-cal", "TECHNIQUE · 02",
  '<h1 class="head">案例拆解：日历 7 列坍缩是<span class="hl">三因相乘</span></h1>',
  f'''
  <div style="display:flex;gap:40px;align-items:flex-start;justify-content:center;margin-top:30px">
    <div style="flex:1;display:flex;flex-direction:column">
      <div class="shot-frame" style="height:400px"><img src="{IMG['cal_broken']}" alt="broken" style="height:100%;object-fit:contain"></div>
      <div class="cap">修复前 · 网格压成数字串</div>
    </div>
    <div style="flex:1;display:flex;flex-direction:column">
      <div class="shot-frame" style="height:400px"><img src="{IMG['cal_fixed']}" alt="fixed" style="height:100%;object-fit:contain"></div>
      <div class="cap">修复后 · 262px 固定宽</div>
    </div>
  </div>
  <div class="lede frag" data-f style="margin-top:18px;font-size:32px">气泡 <b class="mono">width:auto</b> × 网格 <b class="mono">1fr</b> × 格子 <b class="mono">min-width:0</b> 三因相乘 → 收敛到 110px。<b>直接测量 bubble 宽度</b>即可定位。</div>
  <div style="height:76px;flex:0 0 auto"></div>
  ''', 1,
  "修复前截图是忠实复现的（把 width 改回 auto 重拍）——「修复前后对照」本身也可以是再生资产。"),

S("s-t-lying", "TECHNIQUE · 03",
  '<h1 class="head">演示诚实度：<span class="hl">假命令比没有命令更糟</span></h1>',
  '''
  <div class="body-row">
    <div class="col" style="flex:1">
      <div class="card a-in" style="border-color:rgba(229,96,76,.45)"><div class="ct" style="color:#e5604c">审计发现（P1）</div>
        <div class="cd">⌘K 面板里「切换到 10s 转速」点击后只弹 toast 说「本页为静态展示」——
        <b>但转速档位明明真实可用</b>。分页点击也只有 toast，页面无任何变化。</div></div>
    </div>
    <div class="col" style="flex:1">
      <div class="card frag" data-f><div class="ct" style="color:#46b37a">修复后</div>
        <div class="cd">假命令 → <b>真命令</b>：点击即真实激活 10s 档位<br>
        假翻页 → <b>真联动</b>：页码实时写入「第 N / 9 页」</div></div>
      <div class="card frag" data-f><div class="ct">为什么严重</div>
        <div class="cd">模板页是<b>规范的化身</b>——一条撒谎的交互会教会
        agent「演示交互可以不干活」</div></div>
    </div>
  </div>
  ''', 2,
  "判断标准一句话：点了必须有真实状态变化；做不到就别放进演示页。"),

# ═══════════════════════ 05 收尾 ═══════════════════════
S("s-deliver", "DELIVERABLES",
  '<h1 class="head">最终交付物：<span class="hl">五个入口，各司其职</span></h1>',
  '''
  <div class="body-row">
    <div class="card frag" data-f style="flex:1"><div class="ct mono" style="font-size:27px;color:#f2a93c">README.md</div>
      <div class="cd"><b>过程</b> —— 指令×产出×commit 三列对照<br>下次照着做的剧本</div></div>
    <div class="card frag" data-f style="flex:1"><div class="ct mono" style="font-size:27px;color:#8f7bf5">STYLE-GUIDE.md</div>
      <div class="cd"><b>契约</b> —— token · 公式 · 禁忌<br>+ 一句话生成指令</div></div>
    <div class="card frag" data-f style="flex:1"><div class="ct mono" style="font-size:27px;color:#35c3b4">demo/example.html</div>
      <div class="cd"><b>参照</b> —— 完整样例（真实数据）<br>agent 生成页面的入口</div></div>
    <div class="card frag" data-f style="flex:1"><div class="ct mono" style="font-size:27px;color:#46b37a">demo6.html</div>
      <div class="cd"><b>真源</b> —— 浏览器内渲染真实 TSX<br>组件行为的唯一权威</div></div>
    <div class="card frag" data-f style="flex:1"><div class="ct mono" style="font-size:27px;color:#e5604c">fetch-data.py</div>
      <div class="cd"><b>数据</b> —— 腾讯行情 + 东财资金流<br>REAL/MOCK 双轨</div></div>
  </div>
  <div class="lede frag" data-f style="margin-top:40px">给 agent 的最小指令组合：<b>读 STYLE-GUIDE → 打开 example → 抄 token 与结构</b>。</div>
  ''', 6,
  "五件套的关系：过程可复盘、契约可执行、参照可模仿、真源可验证、数据可再生。"),

S("s-cheat", "CHEATSHEET",
  '<h1 class="head">速查卡：七步<span class="hl">一句话版</span></h1>',
  '''
  <div class="tl" style="margin-top:40px">
    <div class="tl-row frag" data-f><div class="w">① 取证</div><div class="t">拆帧/截图，<b>量化一切</b>——色值成体系、效果成公式、数量成参数</div></div>
    <div class="tl-row frag" data-f><div class="w">② 立规</div><div class="t">token 收编一切 + <b>STYLE-GUIDE 先行</b> + 一句话生成指令</div></div>
    <div class="tl-row frag" data-f><div class="w">③ 签名</div><div class="t">先做 <b>1–2 个灵魂组件</b>，静态→动态→物理三轮打磨</div></div>
    <div class="tl-row frag" data-f><div class="w">④ 铺满</div><div class="t">50 个原语同一套 token，<b>copy-own-code</b> 零黑盒</div></div>
    <div class="tl-row frag" data-f><div class="w">⑤ 验证</div><div class="t">画廊页→<b>实战页(真数据)</b>→合并样例页</div></div>
    <div class="tl-row frag" data-f><div class="w">⑥ 审计</div><div class="t">「严苛大师 20 问」×N 轮，<b>组件缺陷优先</b>，断言式修复</div></div>
    <div class="tl-row frag" data-f><div class="w">⑦ 加固</div><div class="t"><b>真源管线防漂移</b> + Puppeteer 探针确定性验收</div></div>
  </div>
  ''', 7,
  "拍屏保存页。前两步决定像不像，后五步决定能不能被复用。"),

S("s-end", "FIN",
  '',
  '''
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center">
    <div class="badge a-in" style="margin-bottom:40px">NEXT TIME YOU SEE A BEAUTIFUL UI</div>
    <h1 class="a-in" style="font-size:80px;font-weight:700;line-height:1.3">
      你的第一步不是打开编辑器，<br>是<span style="color:#f2a93c;text-shadow:0 0 30px rgba(242,169,60,.4)">拆帧取证</span>
    </h1>
    <p class="a-in" style="font-size:38px;color:#9a9aa5;margin-top:44px;line-height:1.8">
      剩下的六步，这个仓库里都有现成的答案
    </p>
    <div class="a-in mono" style="font-size:30px;color:#f2a93c;margin-top:36px;border:1px solid rgba(242,169,60,.4);
         border-radius:12px;padding:18px 34px;box-shadow:0 0 40px -12px rgba(242,169,60,.5)">
      github.com/flyingtimes/clark-dark-glow-theme
    </div>
  </div>
  ''', 0,
  "收尾。行动号召：收藏仓库，下次遇到心动 UI，从 ffmpeg 拆帧开始。"),

# ═══════════════════════ 分支：40 项修复 ═══════════════════════
S("s-fix-cats", "BRANCH · 40 FIXES",
  '<h1 class="head">40 项修复<span class="hl">按六类归档</span>（主题破裂优先）</h1>',
  '''
  <div class="tl" style="margin-top:36px">
    <div class="tl-row frag" data-f style="border-left-color:#e5604c"><div class="w" style="color:#e5604c">主题破裂 ×3</div><div class="t">白表头按钮 · 面包屑默认蓝链接 · 系统蓝焦点环<span> —— 同源：拼装丢失 base reset，一次修三处</span></div></div>
    <div class="tl-row frag" data-f style="border-left-color:#f2a93c"><div class="w" style="color:#f2a93c">组件破损 ×4</div><div class="t">日历 7 列坍缩 · chart 缺数值/基线 · 强度列裸数字 · OTP 分隔符歧义</div></div>
    <div class="tl-row frag" data-f style="border-left-color:#35c3b4"><div class="w" style="color:#35c3b4">数据呈现 ×5</div><div class="t">chip 重复 · 千分位不一致 · 分时图标签重叠/无刻度 · 外推无图例 · scrub 不跟随</div></div>
    <div class="tl-row frag" data-f style="border-left-color:#8f7bf5"><div class="w" style="color:#8f7bf5">交互可发现 ×9</div><div class="t">Dialog 无✕ · 危险钮层级 · Drawer 无手势 · ⌘K 假命令 · 假翻页 · 删除命中区 · 添加无反馈…</div></div>
    <div class="tl-row frag" data-f style="border-left-color:#46b37a"><div class="w" style="color:#46b37a">展示密度 ×8</div><div class="t">无站点导航 · 等高留白 · tooltip 无目标 · typography 无层级 · skeleton 寒酸 · aspect 空盒…</div></div>
    <div class="tl-row frag" data-f style="border-left-color:#9a9aa5"><div class="w">文案语义 ×6</div><div class="t">Alert 开发黑话 · 空态方位词 · emoji 破规 · teal 语义占用 · 徽章断行 · 页面自述过时</div></div>
  </div>
  <div class="lede frag" data-f style="margin-top:26px">排序即严重度：<b>「看起来坏了」永远优先于「不够精致」</b>。</div>
  ''', 7,
  "分支页 1/2。六类色标与主主题的语义色一致——红=破裂、琥珀=破损、青=数据、紫=交互、绿=密度。"),

S("s-fix-table", "BRANCH · SAMPLE",
  '<h1 class="head">修复样例：数据表的<span class="hl">三处升级</span></h1>',
  f'''
  <div class="body-row">
    <div class="col" style="flex:1.5">{img("datatable", flex=True, cap="主题化表头 + 强度迷你条 + 排序指示")}</div>
    <div class="col">
      <div class="li frag" data-f><div class="n">1</div><div class="t"><b>表头按钮主题化</b><span> —— 透明底 + hover 琥珀，消灭白块</span></div></div>
      <div class="li frag" data-f><div class="n">2</div><div class="t"><b>强度列可视化</b><span> —— 裸数字 → 琥珀迷你条，宽度=值</span></div></div>
      <div class="li frag" data-f><div class="n">3</div><div class="t"><b>排序可发现性</b><span> —— 半透明 ↕ 提示可点 · 激活列实色箭头 · aria-sort</span></div></div>
    </div>
  </div>
  ''', 3,
  "分支页 2/2。表格是「信息密度最高的组件」，也是审计命中率最高的地方。")

# 主线 / 分支划分
BRANCH_IDS = {"s-fix-cats", "s-fix-table"}
MAIN = [s for s in SLIDES if s["id"] not in BRANCH_IDS]
BRANCH = [s for s in SLIDES if s["id"] in BRANCH_IDS]

# ─────────────────────────────────────────────────────────────
# 时间轴分配
def layout():
    t = 0
    for s in MAIN:
        s["start"] = t; t += D
    total_main = t
    for s in BRANCH:
        s["start"] = t; t += D
    return total_main, t

TOTAL_MAIN, TOTAL = layout()

def frags_for(s):
    n = s.get("n_frag_actual", s["nfrags"])
    if n <= 0: return []
    first, step = (1.4, 0.9) if n >= 6 else (2.0, 1.15)
    return [round(s["start"] + first + i * step, 2) for i in range(n) if s["start"] + first + i * step <= s["start"] + D - 0.6]

# ─────────────────────────────────────────────────────────────
# 场景 HTML
def scene(s):
    frags = frags_for(s)
    kick = f'<div class="kicker a-in">{s["kicker"]}</div>' if s["kicker"] else ""
    return f'''
<div id="scene-{s['id']}" class="scene-frame clip" data-composition-id="{s['id']}"
     data-start="{s['start']}" data-duration="{D}" data-label="{s['kicker'] or s['id']}"
     data-track-index="1" style="background:#0a0a0c">
  <div class="slide">
    {kick}{s['title']}{s['body']}
    <div class="amb-dot" id="{s['id']}-amb"></div>
    <div class="foot"><span>clark dark glow theme · 教学 deck</span><span>{s['id']}</span></div>
  </div>
</div>'''

def timeline_all():
    out = []
    for s in MAIN + BRANCH:
        sid = s["id"]
        for i in range(s.get("n_ain", 0)):
            out.append(f"""(function(tl){{ tl.fromTo('#{sid}-ain{i}', {{x:0,y:26,autoAlpha:0}}, {{x:0,y:0,autoAlpha:1,duration:.5,ease:'power2.out'}}, {s["start"]+0.05+i*0.09:.2f}); }})(window.__timelines["root"]);""")
        for i, t in enumerate(frags_for(s)):
            out.append(f"""(function(tl){{ tl.set('#{sid}-f{i}', {{autoAlpha:1}}, {t}); }})(window.__timelines["root"]);""")
        out.append(f"""(function(tl){{ tl.to('#{sid}-amb', {{opacity:.5, duration:2, yoyo:true, repeat:3, ease:'sine.inOut'}}, {s["start"]}); }})(window.__timelines["root"]);""")
    out.append(f'  tl.to({{}}, {{duration:{TOTAL}}}, 0);')
    body = chr(10).join(out)
    return f"""
window.__timelines = window.__timelines || {{}};
window.__timelines["root"] = gsap.timeline({{paused:true}});
(function(tl){{
{body}
}})(window.__timelines["root"]);"""

# data-f 标记：为每个 .frag 元素按出现顺序编号
def stamp_frags(body):
    idx = -1
    out, pos = [], 0
    while True:
        i = body.find('class="', pos)
        # 简化：直接替换 frag 标记串
        break
    return body

def island():
    slides = []
    for s in MAIN:
        e = {"sceneId": s["id"], "notes": s["notes"]}
        f = frags_for(s)
        if f: e["fragments"] = f
        if s["id"] == "s-st11":
            e["hotspots"] = [{"id": "h-fixes", "label": "深入：40 项修复全览",
                              "target": "fixes-deep-dive",
                              "region": {"x": 55, "y": 72, "w": 42, "h": 18}}]
        slides.append(e)
    seq = {"id": "fixes-deep-dive", "label": "40 项修复全览", "slides": []}
    for s in BRANCH:
        e = {"sceneId": s["id"], "notes": s["notes"]}
        f = frags_for(s)
        if f: e["fragments"] = f
        seq["slides"].append(e)
    return json.dumps({"slides": slides, "slideSequences": [seq]}, ensure_ascii=False, indent=2)

def build():
    # data-f 编号：逐场景把 data-f 占位替换为索引
    import re
    for s in SLIDES:
        # a-in 元素：盖 <sid>-ain<n>
        c = [0]
        def sub_ain(m):
            cid = f'{s["id"]}-ain{c[0]}'; c[0] += 1
            return f'class="{m.group(1)}" id="{cid}"'
        s["body"] = re.sub(r'class="([^"]*\ba-in\b[^"]*)"', sub_ain, s["body"])
        s["n_ain"] = c[0]
        # frag 元素：盖 <sid>-f<n> + data-f 编号
        c2 = [0]
        def sub_frag(m):
            cid = f'{s["id"]}-f{c2[0]}'; c2[0] += 1
            return f'{m.group(1)} id="{cid}" data-f="{c2[0]-1}"'
        s["body"] = re.sub(r'(<[^>]*class="[^"]*\bfrag\b[^"]*") data-f(?![="])', sub_frag, s["body"])
        s["n_frag_actual"] = c2[0]
    os.makedirs("composition", exist_ok=True)
    scenes = "\n".join(scene(s) for s in MAIN + BRANCH)
    tls = timeline_all() + """

/* 场景可见性控制器（standalone/无引擎模式下由 root timeline 驱动显隐） */
(function(){
  var scenes = %s.map(function(x){ return { id: "scene-" + x.id, start: x.start, end: x.start + %d }; });
  var lastActive = null;
  function updateVisibility(t){
    for (var i = 0; i < scenes.length; i++){
      var sc = scenes[i], el = document.getElementById(sc.id);
      if (!el) continue;
      var active = t >= sc.start && t < sc.end;
      el.style.opacity = active ? "1" : "0";
      el.style.visibility = active ? "visible" : "hidden";
      el.style.pointerEvents = active ? "auto" : "none";
    }
  }
  window.__hfSetTime = updateVisibility;
  updateVisibility(0);
  var root = window.__timelines && window.__timelines["root"];
  if (root) root.eventCallback("onUpdate", function(){ updateVisibility(root.time()); });
})();""" % (json.dumps([{"id": x["id"], "start": x["start"]} for x in MAIN + BRANCH]), D) + """

/* 场景清单桥：向宿主 post 全部场景时间范围（含分支页） */
(function(){
  var FPS = 30;
  var scenes = %s;
  function postTimeline(){
    parent.postMessage({ source: "hf-preview", type: "timeline",
      durationInFrames: %d * FPS, scenes: scenes }, "*");
  }
  if (document.readyState === "complete") setTimeout(postTimeline, 300);
  else window.addEventListener("load", function(){ setTimeout(postTimeline, 300); });
})();""" % (json.dumps([{"id": x["id"], "start": x["start"], "duration": D} for x in MAIN + BRANCH]), TOTAL)
    comp = f'''<!doctype html>
<html lang="zh-CN" data-resolution="landscape">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width={W}, height={H}">
<script src="assets/gsap.min.js"></script>
<style>{CSS}</style>
</head>
<body style="margin:0">
<script type="application/hyperframes-slideshow+json">
{island()}
</script>
<div id="root" data-composition-id="root" data-start="0" data-duration="{TOTAL}"
     data-width="{W}" data-height="{H}"
     style="position:relative;width:{W}px;height:{H}px;overflow:hidden;background:#060608">
{scenes}
</div>
<script>
{tls}
</script>
</body>
</html>
'''
    open("composition/index.html", "w").write(comp)

    wrapper = f'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>从「看到一个喜欢的 UI」到「可复用的 UI 模板」 · 教学 deck</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:100%;height:100%;overflow:hidden;background:#060608}}
</style>
</head>
<body>
<hyperframes-slideshow tabindex="0" style="display:block;position:relative;width:100vw;height:100vh">
  <hyperframes-player interactive style="position:absolute;inset:0" src="composition/index.html"></hyperframes-player>
  <script type="application/hyperframes-slideshow+json">
{island()}
  </script>
</hyperframes-slideshow>
<script src="https://cdn.jsdelivr.net/npm/@hyperframes/player@0/dist/hyperframes-player.global.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@hyperframes/slideshow@0/dist/hyperframes-slideshow.global.js"></script>
</body>
</html>
'''
    open("index.html", "w").write(wrapper)
    print(f"MAIN={len(MAIN)} BRANCH={len(BRANCH)} TOTAL={TOTAL}s island slides={len(MAIN)}")

if __name__ == "__main__":
    build()
