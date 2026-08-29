import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

export const DIAL_BLOCKS = [
  { name: "THE ROOT", range: "0–12", color: "var(--accent-violet)" },
  { name: "THE OFFER", range: "12–24", color: "var(--accent-amber)" },
  { name: "THE SURFACE", range: "24–36", color: "var(--accent-teal)" },
  { name: "THE HUNT", range: "36–48", color: "var(--accent-red)" },
  { name: "THE CLOCK", range: "48–60", color: "var(--accent-green)" },
] as const

/** minute(0–59) → 当前块下标；越界收敛到 0–4 */
export const blockOf = (minute: number) => Math.min(4, Math.max(0, Math.floor(minute / 12)))

/** 极坐标（角度从 12 点方向顺时针）→ viewBox 内坐标 */
const P = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180
  return { x: 200 + r * Math.sin(a), y: 200 - r * Math.cos(a) }
}

export type DialLabel = {
  name: string
  range: string
  color: string
  desc?: string
  /** 高亮第二行（如 THE ROOT 的 “YOU, alone…”） */
  desc2?: string
  /** 定位：left/right/top 百分比 + textAlign，相对转盘容器 */
  style?: CSSProperties
}

/** 默认环形标签（还原视频版式；位置按 400×430 容器手调，允许溢出容器） */
export const DIAL_LABELS: DialLabel[] = [
  {
    name: "THE ROOT", range: "0–12", color: "var(--accent-violet)",
    desc: "who buys · what we sell · at what price",
    desc2: "YOU, alone — a model cannot write it",
    style: { left: "66%", top: "9%", textAlign: "left" },
  },
  {
    name: "THE OFFER", range: "12–24", color: "var(--accent-amber)",
    desc: "one page · the price · the objection",
    style: { left: "89%", top: "56%", textAlign: "left" },
  },
  {
    name: "THE SURFACE", range: "24–36", color: "var(--accent-teal)",
    desc: "landing · payment link · auto-replies",
    style: { left: "50%", top: "96%", transform: "translateX(-50%)", textAlign: "center" },
  },
  {
    name: "THE HUNT", range: "36–48", color: "var(--accent-red)",
    desc: "the buyer sits · signals scored",
    desc2: "only block that leaves the ring",
    style: { right: "79%", top: "53%", textAlign: "right" },
  },
  {
    name: "THE CLOCK", range: "48–60", color: "var(--accent-green)",
    desc: "cron · three numbers · self-patch",
    style: { right: "76%", top: "9%", textAlign: "right" },
  },
]

type TheDialProps = {
  /** 当前分钟 0–59：由外部时钟（useMinuteClock）驱动 */
  minute: number
  centerTitle?: string
  centerSub?: string
  /** 中心药丸下方注释行；传 null 关闭 */
  centerNote?: string[] | null
  /** 环形标签；传 null 关闭 */
  labels?: DialLabel[] | null
  /** 圆心→色区中点的细线 + 色点，默认开 */
  showSpokes?: boolean
  /** 顶部 “block 05 rewrites block 01” 绿色回写箭头，默认开 */
  showFeedbackArc?: boolean
  /** 环内 0/12/24/36/48 刻度数字，默认开 */
  showNumbers?: boolean
  className?: string
}

/**
 * TheDial — 还原视频的 60 刻度转盘：
 * - 高亮模型：当前块整块点亮 + 辉光，已完成块半亮，未来块暗（不是累积进度环）
 * - 指针角度由 minute 推导（transition 补间），与 MinuteList 共享同一 state
 * - viewBox 0 -30 400 430：顶部留白给回写箭头；标签为 HTML 绝对定位，允许溢出容器
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
  className,
}: TheDialProps) {
  const bi = blockOf(minute)

  return (
    <div
      className={cn("relative w-full max-w-[560px]", className)}
      style={{ aspectRatio: "400 / 430" }}
    >
      <svg viewBox="0 -30 400 430" className="absolute inset-0 h-full w-full">
        {/* 60 刻度 */}
        {Array.from({ length: 60 }, (_, i) => {
          const b = Math.floor(i / 12)
          const color = DIAL_BLOCKS[b].color
          const state = b === bi ? "current" : b < bi ? "done" : "todo"
          const opacity = state === "current" ? 0.92 : state === "done" ? 0.3 : 0.14
          return (
            <g key={i} transform={`rotate(${i * 6} 200 200)`}>
              <rect
                x={192} y={22} width={16} height={52} rx={5}
                fill={color}
                fillOpacity={opacity}
                style={{
                  filter: state === "current" ? `drop-shadow(0 0 9px ${color})` : undefined,
                  transition: "fill-opacity .7s ease, filter .7s ease",
                }}
              />
            </g>
          )
        })}

        {showNumbers &&
          [0, 12, 24, 36, 48].map((m) => {
            const p = P(m * 6, 100)
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

        {/* 区块中线 + 色点：视觉上把环上的色区与外部标签连起来 */}
        {showSpokes &&
          DIAL_BLOCKS.map((blk, k) => {
            const a = k * 72 + 36
            const p1 = P(a, 40)
            const p2 = P(a, 170)
            const pd = P(a, 176)
            return (
              <g key={blk.name}>
                <line
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke="var(--accent-amber)" strokeWidth={1} opacity={0.4}
                />
                <circle
                  cx={pd.x} cy={pd.y} r={4} fill={blk.color}
                  style={{ filter: `drop-shadow(0 0 6px ${blk.color})` }}
                />
              </g>
            )
          })}

        {/* block 05 → block 01 回写箭头（弧顶越过 12 点方向） */}
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

        {/* 扫针：直达刻度带 */}
        <g
          style={{
            transform: `rotate(${minute * 6}deg)`,
            transformOrigin: "200px 200px",
            transition: "transform 1s linear",
          }}
        >
          <line
            x1={200} y1={200} x2={200} y2={30}
            stroke="var(--accent-amber)" strokeWidth={1.5} opacity={0.75}
          />
          <circle
            cx={200} cy={30} r={4.5} fill="var(--accent-amber)"
            style={{ filter: "drop-shadow(0 0 7px var(--accent-amber))" }}
          />
        </g>
      </svg>

      {/* 中心药丸 + 注释（圆心在容器 50% / 53.5%） */}
      <div className="absolute left-1/2 top-[53.5%] -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="rounded-xl border border-accent-amber/60 bg-background/70 px-7 py-4 shadow-[0_0_40px_-10px_var(--accent-amber)] backdrop-blur-sm">
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
          </div>
        )
      })}
    </div>
  )
}
