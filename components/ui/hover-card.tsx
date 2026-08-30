"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** 悬停卡片：hover 展开的大号预览卡；触发器贴近视口顶部时自动翻到下方 */
export function HoverCard({
  trigger, children, className,
}: { trigger: React.ReactNode; children: React.ReactNode; className?: string }) {
  const [above, setAbove] = React.useState(true)
  const ref = React.useRef<HTMLSpanElement>(null)

  const onEnter = () => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setAbove(rect.top > 260)      // 上方空间足够才显示在上方
  }

  return (
    <span
      ref={ref}
      data-slot="hover-card"
      className={cn("group relative inline-flex", className)}
      onMouseEnter={onEnter}
    >
      <span className="cursor-pointer text-accent-amber underline decoration-accent-amber/40 underline-offset-4 transition-colors hover:decoration-accent-amber">
        {trigger}
      </span>
      <span
        style={above ? { bottom: "calc(100% + 10px)" } : { top: "calc(100% + 10px)" }}
        className={cn(
          "pointer-events-none absolute left-1/2 z-[85] w-72 -translate-x-1/2 rounded-xl border border-border bg-card p-4",
          "opacity-0 shadow-[0_0_40px_-14px_var(--accent-amber)] transition-all duration-200 group-hover:opacity-100",
          above ? "" : ""
        )}
      >
        {children}
      </span>
    </span>
  )
}
