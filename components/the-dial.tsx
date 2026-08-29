import { cn } from "@/lib/utils"

export const DIAL_BLOCKS = [
  { name: "THE ROOT", range: "0–12", color: "var(--accent-violet)" },
  { name: "THE OFFER", range: "12–24", color: "var(--accent-amber)" },
  { name: "THE SURFACE", range: "24–36", color: "var(--accent-teal)" },
  { name: "THE HUNT", range: "36–48", color: "var(--accent-red)" },
  { name: "THE CLOCK", range: "48–60", color: "var(--accent-green)" },
] as const

type TheDialProps = {
  /** 当前分钟 0–59：由外部时钟（useMinuteClock）驱动，与 MinuteList 等同源联动 */
  minute: number
  centerTitle?: string
  centerSub?: string
  className?: string
}

/** 60 刻度 SVG 转盘：5 个 12 分钟色区，指针角度由 minute 推导（不用独立 CSS 动画，保证与清单同步） */
export function TheDial({ minute, centerTitle = "ROOT.md", centerSub = "5 blocks · 12 minutes each", className }: TheDialProps) {
  return (
    <div className={cn("relative aspect-square w-full max-w-[560px]", className)}>
      <svg viewBox="0 0 400 400" className="h-full w-full">
        {Array.from({ length: 60 }, (_, i) => {
          const color = DIAL_BLOCKS[Math.floor(i / 12)].color
          const active = i <= minute
          return (
            <g key={i} transform={`rotate(${i * 6} 200 200)`}>
              <rect
                x={186} y={22} width={28} height={46} rx={7}
                fill={color}
                fillOpacity={active ? 0.85 : 0.16}
                style={{
                  filter: active ? `drop-shadow(0 0 8px ${color})` : undefined,
                  transition: "fill-opacity .7s ease, filter .7s ease",
                }}
              />
            </g>
          )
        })}
        {[0, 12, 24, 36, 48].map((m) => {
          const a = ((m * 6 - 90) * Math.PI) / 180
          return (
            <text
              key={m}
              x={200 + 78 * Math.cos(a)}
              y={200 + 78 * Math.sin(a) + 4}
              textAnchor="middle"
              fontSize={11}
              fill="currentColor"
              opacity={0.35}
              className="font-mono"
            >
              {m}
            </text>
          )
        })}
        {/* 扫针：transform 由 state 推导 + transition 补间 */}
        <g
          style={{
            transform: `rotate(${minute * 6}deg)`,
            transformOrigin: "200px 200px",
            transition: "transform 1s linear",
          }}
        >
          <line x1={200} y1={200} x2={200} y2={54} stroke="var(--accent-amber)" strokeWidth={1.5} opacity={0.75} />
          <circle
            cx={200} cy={54} r={4} fill="var(--accent-amber)"
            style={{ filter: "drop-shadow(0 0 6px var(--accent-amber))" }}
          />
        </g>
      </svg>
      {/* 中心药丸 */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="rounded-xl border border-accent-amber/60 bg-background/70 px-6 py-4 text-center shadow-[0_0_36px_-10px_var(--accent-amber)] backdrop-blur-sm">
          <div className="text-lg font-bold">{centerTitle}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">{centerSub}</div>
        </div>
      </div>
    </div>
  )
}
