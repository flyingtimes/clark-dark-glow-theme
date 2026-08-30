import * as React from "react"
import { cn } from "@/lib/utils"

const CHART_TONE: Record<string, string> = {
  amber: "var(--accent-amber)", violet: "var(--accent-violet)", teal: "var(--accent-teal)",
  green: "var(--accent-green)", red: "var(--accent-red)",
}

type ChartProps = {
  data: { label: string; value: number }[]
  tone?: keyof typeof CHART_TONE
  height?: number
  className?: string
}

/** 主题化柱状图：柱体区域色 + 同色辉光，hover 提示数值 */
function Chart({ data, tone = "amber", height = 180, className }: ChartProps) {
  const color = CHART_TONE[tone]
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div data-slot="chart" className={cn("w-full", className)}>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="group flex h-full flex-1 flex-col justify-end">
            <span className="mb-1 text-center font-mono text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {d.value}
            </span>
            <div
              className="w-full cursor-pointer rounded-t-md transition-all duration-300 group-hover:brightness-125"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: `color-mix(in oklab, ${color} 60%, transparent)`,
                boxShadow: `0 0 16px -6px ${color}`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center font-mono text-[11px] text-muted-foreground">{d.label}</div>
        ))}
      </div>
    </div>
  )
}

export { Chart, CHART_TONE }
