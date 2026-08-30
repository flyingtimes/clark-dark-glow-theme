"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** 折叠面板：▸ 旋转 90° 展开，grid-rows 过渡 */
export function Collapsible({
  title, children, defaultOpen = false, className,
}: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div data-slot="collapsible" data-state={open ? "open" : "closed"} className={cn("rounded-lg border border-border bg-card", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left font-mono text-[12px] transition-colors hover:text-accent-amber"
      >
        <span className={cn("text-accent-amber transition-transform duration-200", open && "rotate-90")}>▸</span>
        {title}
      </button>
      <div className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="px-4 pb-3 text-[12px] leading-relaxed text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  )
}
