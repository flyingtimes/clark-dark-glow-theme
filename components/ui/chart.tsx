"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type ChartDatum = { label: string; value: number }

type ChartProps = {
  data: ChartDatum[]
  tone?: "amber" | "violet" | "teal" | "green" | "red"
  height?: number
  /** 柱顶常显数值（默认开——触屏/键盘也能读数，不依赖 hover） */
  showValues?: boolean
  /** 底部基线，默认开 */
  baseline?: boolean
  className?: string
}

const TONE: Record<string, string> = {
  amber: "var(--accent-amber)", violet: "var(--accent-violet)", teal: "var(--accent-teal)",
  green: "var(--accent-green)", red: "var(--accent-red)",
}

/** 主题化柱状图：常显数值 + 底部基线 + 同色辉光 */
function Chart({ data, tone = "amber", height = 180, showValues = true, baseline = true, className }: ChartProps) {
  const color = TONE[tone]
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div data-slot="chart" className={cn("w-full", className)}>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="group flex h-full flex-1 flex-col justify-end gap-1">
            {showValues && (
              <span className="text-center font-mono text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">
                {d.value}
              </span>
            )}
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
      {baseline && <div className="h-px w-full bg-border" />}
      <div className="mt-2 flex gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center font-mono text-[11px] text-muted-foreground">{d.label}</div>
        ))}
      </div>
    </div>
  )
}

export { Chart }
