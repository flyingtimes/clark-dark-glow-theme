import { useId, useRef } from "react"
import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

export const DIAL_BLOCKS = [
  { name: "THE ROOT", range: "0–12", color: "var(--accent-violet)" },
  { name: "THE OFFER", range: "12–24", color: "var(--accent-amber)" },
  { name: "THE SURFACE", range: "24–36", color: "var(--accent-teal)" },
  { name: "THE HUNT", range: "36–48", color: "var(--accent-red)" },
  { name: "THE CLOCK", range: "48–60", color: "var(--accent-green)" },
] as const

/** minute(0–59，可为小数) → 当前块下标 */
export const blockOf = (minute: number) => Math.min(4, Math.max(0, Math.floor(minute / 12)))

const f2 = (n: number) => Math.round(n * 100) / 100
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return { x: f2(200 + r * Math.sin(a)), y: f2(200 - r * Math.cos(a)) }
}

/** 圆角环扇形：视频刻度段的形状（外弧 + 圆角 + 内弧） */
const sectorPath = (r0: number, r1: number, a0: number, a1: number, rc = 4.5) => {
  const dO = (rc / r1) * (180 / Math.PI)
  const dI = (rc / r0) * (180 / Math.PI)
  const p1 = polar(r1, a0 + dO), p2 = polar(r1, a1 - dO)
  const c1 = polar(r1, a1), e1 = polar(r1 - rc, a1)
  const e2 = polar(r0 + rc, a1), c2 = polar(r0, a1), p3 = polar(r0, a1 - dI)
  const p4 = polar(r0, a0 + dI), c3 = polar(r0, a0), e3 = polar(r0 + rc, a0)
  const e4 = polar(r1 - rc, a0), c4 = polar(r1, a0)
  return (
    `M ${p1.x} ${p1.y} A ${r1} ${r1} 0 0 1 ${p2.x} ${p2.y} ` +
    `Q ${c1.x} ${c1.y} ${e1.x} ${e1.y} L ${e2.x} ${e2.y} ` +
    `Q ${c2.x} ${c2.y} ${p3.x} ${p3.y} A ${r0} ${r0} 0 0 0 ${p4.x} ${p4.y} ` +
    `Q ${c3.x} ${c3.y} ${e3.x} ${e3.y} L ${e4.x} ${e4.y} ` +
    `Q ${c4.x} ${c4.y} ${p1.x} ${p1.y} Z`
  )
}

/** 楔形（指针拖尾光楔） */
const wedgePath = (r0: number, r1: number, a0: number, a1: number) => {
  const p1 = polar(r0, a0), p2 = polar(r1, a0), p3 = polar(r1, a1), p4 = polar(r0, a1)
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${r1} ${r1} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${r0} ${r0} 0 0 0 ${p1.x} ${p1.y} Z`
}

const RING = { r0: 124, r1: 180 }
const SEGS_PER_ZONE = 6          // 每区 6 段，共 30 段，每段 2 分钟
const GAP_DEG = 1.6              // 段间缝
const TRAIL_DEG = 32             // 拖尾光楔张角

export type DialLabel = {
  name: string
  range: string
  color: string
  desc?: string
  /** 高亮第二行 */
  desc2?: string
  desc3?: string
  /** 定位：left/right/top 百分比 + textAlign，相对转盘容器（允许溢出） */
  style?: CSSProperties
}

/** 默认环形标签（还原视频版式；位置按 -40 -30 480 452 容器手调） */
export const DIAL_LABELS: DialLabel[] = [
  {
    name: "THE ROOT", range: "0–12", color: "var(--accent-violet)",
    desc: "who buys · what we sell · at what price",
    desc2: "YOU, alone — the only block a model cannot write",
    style: { left: "76%", top: "3%", textAlign: "left" },
  },
  {
    name: "THE OFFER", range: "12–24", color: "var(--accent-amber)",
    desc: "one page · the price · the objection · Opus 5",
    style: { left: "96%", top: "65%", textAlign: "left" },
  },
  {
    name: "THE SURFACE", range: "24–36", color: "var(--accent-teal)",
    desc: "landing · payment link · auto-replies · Sonnet ×3",
    style: { left: "50%", top: "103%", transform: "translateX(-50%)", textAlign: "center" },
  },
  {
    name: "THE HUNT", range: "36–48", color: "var(--accent-red)",
    desc: "the buyer sits · signals scored",
    desc2: "only block that leaves the ring",
    desc3: "out into the market",
    style: { right: "110%", top: "62%", textAlign: "right" },
  },
  {
    name: "THE CLOCK", range: "48–60", color: "var(--accent-green)",
    desc: "cron · three numbers · self-patch",
    style: { right: "94%", top: "3%", textAlign: "right" },
  },
]

type TheDialProps = {
  /** 当前分钟 0–59，可为小数（连续时钟 → 指针平滑扫动、段跟随点亮） */
  minute: number
  centerTitle?: string
  centerSub?: string
  centerNote?: string[] | null
  labels?: DialLabel[] | null
  /** 圆心→色点线 + 色点 + 外引线（HUNT 为贯穿线），默认开 */
  showSpokes?: boolean
  /** 顶部 “block 05 rewrites block 01” 回写箭头，默认开 */
  showFeedbackArc?: boolean
  /** 环内 0/12/24/36/48 数字，默认开 */
  showNumbers?: boolean
  /** 指针身后 32° 渐隐光楔，默认开 */
  trail?: boolean
  className?: string
}

/**
 * TheDial — 还原视频的转盘：
 * - 30 个圆角环扇形刻度（6 段/区），当前区内“指针扫过的段”点亮（不是整块同时亮）
 * - 刚扫完的区半亮（0.3），其余 0.2，未扫到的 0.15
 * - 指针身后 32° 渐隐光楔；指针角度累计连续，跨圈不倒转
 * - 色点在环带中带，向外引短线连标签；只有 HUNT（block 04）是从圆心贯穿到标签的线
 */
export function TheDial({
  minute,
  centerTitle = "ROOT.md",
  centerSub = "5 blocks · 12 minutes each",
  centerNote = ["you write the first block —", "the file writes the other four"],
  labels = DIAL_LABELS,
  showSpokes = true,
  showFeedbackArc = true,
  showNumbers = true,
  trail = true,
  className,
}: TheDialProps) {
  const bi = blockOf(minute)
  const uid = useId()
  const trailId = `dialTrail${uid.replace(/[^a-zA-Z0-9]/g, "")}`

  // 指针累计角度：按最短差值累加，跨圈（59→0）不倒转
  const handRef = useRef({ prev: minute, angle: minute * 6 })
  const dmRaw = minute - handRef.current.prev
  const dm = (((dmRaw + 30) % 60) + 60) % 60 - 30
  handRef.current = { prev: minute, angle: handRef.current.angle + dm * 6 }
  const handAngle = handRef.current.angle

  const g1 = polar(150, handAngle - TRAIL_DEG)
  const g2 = polar(150, handAngle)

  return (
    <div
      className={cn("relative w-full max-w-[560px]", className)}
      style={{ aspectRatio: "480 / 452" }}
    >
      <style>{`@keyframes dialPillGlow{0%,100%{box-shadow:0 0 42px -10px var(--accent-amber)}50%{box-shadow:0 0 26px -12px var(--accent-amber)}}`}</style>

      <svg viewBox="-40 -30 480 452" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={trailId} gradientUnits="userSpaceOnUse" x1={g1.x} y1={g1.y} x2={g2.x} y2={g2.y}>
            <stop offset="0" stopColor="var(--accent-amber)" stopOpacity={0.16} />
            <stop offset="1" stopColor="var(--accent-amber)" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* 指针拖尾光楔（最底层，位于刻度之下） */}
        {trail && (
          <path
            d={wedgePath(36, RING.r1, handAngle - TRAIL_DEG, handAngle)}
            fill={`url(#${trailId})`}
          />
        )}

        {/* 30 个圆角环扇形刻度：跟随指针逐段点亮 */}
        {Array.from({ length: 30 }, (_, k) => {
          const z = Math.floor(k / SEGS_PER_ZONE)
          const color = DIAL_BLOCKS[z].color
          const swept = k * 2 <= minute               // 每段 2 分钟：段起始 ≤ 当前分钟即已扫过
          const state =
            z === bi ? (swept ? "lit" : "ahead")
            : z === bi - 1 ? "prev"
            : "rest"
          const opacity = state === "lit" ? 0.95 : state === "prev" ? 0.3 : state === "ahead" ? 0.15 : 0.2
          const a0 = k * (360 / 30) + GAP_DEG / 2
          const a1 = (k + 1) * (360 / 30) - GAP_DEG / 2
          return (
            <path
              key={k}
              d={sectorPath(RING.r0, RING.r1, a0, a1)}
              fill={color}
              fillOpacity={opacity}
              style={{
                filter: state === "lit" ? `drop-shadow(0 0 9px ${color})` : undefined,
                transition: "fill-opacity .5s ease, filter .5s ease",
              }}
            />
          )
        })}

        {showNumbers &&
          [0, 12, 24, 36, 48].map((m) => {
            const p = polar(112, m * 6)
            return (
              <text
                key={m}
                x={p.x} y={p.y + 4}
                textAnchor="middle" fontSize={10}
                fill="currentColor" opacity={0.35}
                className="font-mono"
              >
                {m}
              </text>
            )
          })}

        {/* 色点 + 引线：默认 圆心→色点（琥珀）+ 色点→标签（区域色）；
            HUNT（block 04）特殊：从圆心贯穿环带直到标签的线 —— “only block 04 points outward” */}
        {showSpokes &&
          DIAL_BLOCKS.map((blk, k) => {
            const a = k * 72 + 36
            const dot = polar(155, a)
            const hunt = k === 3
            const line = hunt
              ? { from: polar(44, a), to: polar(232, a), color: blk.color, opacity: 0.6 }
              : { from: polar(44, a), to: polar(150, a), color: "var(--accent-amber)", opacity: 0.3 }
            const leader = { from: polar(184, a), to: polar(226, a) }
            const endDot = hunt ? polar(232, a) : null
            return (
              <g key={blk.name}>
                <line
                  x1={line.from.x} y1={line.from.y} x2={line.to.x} y2={line.to.y}
                  stroke={line.color} strokeWidth={1} opacity={line.opacity}
                />
                <line
                  x1={leader.from.x} y1={leader.from.y} x2={leader.to.x} y2={leader.to.y}
                  stroke={blk.color} strokeWidth={1} opacity={0.5}
                />
                {endDot && (
                  <circle cx={endDot.x} cy={endDot.y} r={2.5} fill={blk.color} opacity={0.8} />
                )}
                <circle
                  cx={dot.x} cy={dot.y} r={4} fill={blk.color}
                  style={{ filter: `drop-shadow(0 0 6px ${blk.color})` }}
                />
              </g>
            )
          })}

        {/* block 05 → block 01 回写箭头 */}
        {showFeedbackArc && (
          <g>
            <path
              d="M 62.8 47.7 A 205 205 0 0 1 337.2 47.7"
              fill="none" stroke="var(--accent-green)" strokeWidth={1.5} opacity={0.75}
            />
            <polygon points="344.6,54.4 334.5,50.7 339.9,44.7" fill="var(--accent-green)" opacity={0.9} />
            <text
              x={200} y={-16} textAnchor="middle" fontSize={11}
              fill="var(--accent-green)" opacity={0.9} className="font-mono"
            >
              block 05 rewrites block 01
            </text>
          </g>
        )}

        {/* 扫针：直达并微探出环带外缘 */}
        <g style={{ transform: `rotate(${handAngle}deg)`, transformOrigin: "200px 200px" }}>
          <line
            x1={200} y1={200} x2={200} y2={14}
            stroke="var(--accent-amber)" strokeWidth={1.5} opacity={0.8}
          />
          <circle
            cx={200} cy={14} r={4.5} fill="var(--accent-amber)"
            style={{ filter: "drop-shadow(0 0 7px var(--accent-amber))" }}
          />
        </g>
      </svg>

      {/* 中心药丸 + 注释（圆心在 50% / 50.9%） */}
      <div className="absolute left-1/2 top-[50.9%] -translate-x-1/2 -translate-y-1/2 text-center">
        <div
          className="rounded-xl border border-accent-amber/60 bg-background/70 px-7 py-4 backdrop-blur-sm"
          style={{ boxShadow: "0 0 42px -10px var(--accent-amber)", animation: "dialPillGlow 2.8s ease-in-out infinite" }}
        >
          <div className="text-lg font-bold">{centerTitle}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">{centerSub}</div>
        </div>
        {centerNote && (
          <div className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            {centerNote.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        )}
      </div>

      {/* 环形标签：当前块对应标签点亮 */}
      {(labels ?? []).map((lb, k) => {
        const active = k === bi
        return (
          <div
            key={lb.name}
            className="pointer-events-none absolute w-max font-mono text-[11px] leading-[1.7]"
            style={{
              opacity: active ? 1 : 0.55,
              transition: "opacity .5s ease, text-shadow .5s ease",
              textShadow: active ? `0 0 14px ${lb.color}` : undefined,
              ...lb.style,
            }}
          >
            <span className="text-muted-foreground">{lb.range}</span>
            <span className="mx-1 text-muted-foreground">·</span>
            <span className="font-bold" style={{ color: lb.color }}>{lb.name}</span>
            {lb.desc && <span className="block text-[10px] text-muted-foreground">{lb.desc}</span>}
            {lb.desc2 && (
              <span className="block text-[10px] font-bold" style={{ color: lb.color }}>
                {lb.desc2}
              </span>
            )}
            {lb.desc3 && <span className="block text-[10px] text-muted-foreground">{lb.desc3}</span>}
          </div>
        )
      })}
    </div>
  )
}
