import * as React from "react"
import { cn } from "@/lib/utils"

const TONE_VAR = {
  amber: "var(--accent-amber)",
  violet: "var(--accent-violet)",
  teal: "var(--accent-teal)",
  green: "var(--accent-green)",
  red: "var(--accent-red)",
} as const

type ProgressProps = React.ComponentProps<"div"> & {
  /** 0–100 */
  value?: number
  tone?: keyof typeof TONE_VAR
  /** 终端加载条风格的分段数，默认 20 */
  segments?: number
}

/** 分段进度条：点亮的段带辉光，未点亮为空槽 */
function Progress({ value = 0, tone = "amber", segments = 20, className, ...props }: ProgressProps) {
  const color = TONE_VAR[tone]
  const lit = Math.round((Math.min(100, Math.max(0, value)) / 100) * segments)
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      data-slot="progress"
      data-tone={tone}
      className={cn("flex h-3 items-stretch gap-[3px] rounded-[4px] border border-border bg-card p-[3px]", className)}
      {...props}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          className="flex-1 rounded-[1px] transition-all duration-300"
          style={
            i < lit
              ? { background: color, boxShadow: `0 0 6px ${color}`, opacity: 0.9 }
              : undefined
          }
        />
      ))}
    </div>
  )
}

export { Progress, TONE_VAR }
