"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const WD = ["一", "二", "三", "四", "五", "六", "日"]

type CalendarProps = {
  value?: Date | null
  onChange?: (d: Date) => void
  /** 初始展示月份（默认当天所在月） */
  defaultMonth?: Date
  className?: string
}

function sameDay(a: Date | null | undefined, b: Date) {
  return !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function Calendar({ value, onChange, defaultMonth, className }: CalendarProps) {
  const today = new Date()
  const [view, setView] = React.useState(defaultMonth ?? new Date(today.getFullYear(), today.getMonth(), 1))
  const year = view.getFullYear(), month = view.getMonth()
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7          // 周一开头
  const daysIn = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)]
  const move = (delta: number) => setView(new Date(year, month + delta, 1))

  return (
    <div data-slot="calendar" className={cn("w-[264px] rounded-xl border border-border bg-card p-3 font-mono text-[12px]", className)}>
      <div className="mb-2 flex items-center justify-between">
        <button type="button" aria-label="上一月" onClick={() => move(-1)}
          className="cursor-pointer rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent-amber/10 hover:text-accent-amber">‹</button>
        <span className="text-[13px] font-bold">{year} 年 {month + 1} 月</span>
        <button type="button" aria-label="下一月" onClick={() => move(1)}
          className="cursor-pointer rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent-amber/10 hover:text-accent-amber">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {WD.map((w) => <span key={w} className="py-1">{w}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) =>
          d === null ? <span key={`b${i}`} /> : (
            <button
              key={d}
              type="button"
              onClick={() => onChange?.(new Date(year, month, d))}
              className={cn(
                "cursor-pointer rounded-md py-1.5 transition-all duration-150",
                sameDay(value, new Date(year, month, d))
                  ? "border border-accent-amber/60 bg-accent-amber/12 text-accent-amber shadow-[0_0_12px_-5px_var(--accent-amber)]"
                  : sameDay(today, new Date(year, month, d))
                    ? "border border-border text-foreground hover:border-accent-amber/40"
                    : "text-muted-foreground hover:bg-accent-amber/8 hover:text-foreground"
              )}
            >
              {d}
            </button>
          )
        )}
      </div>
    </div>
  )
}

export { Calendar }
