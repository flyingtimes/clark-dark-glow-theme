"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** 悬停卡片：hover 展开的大号预览卡（适合用户/条目预览） */
export function HoverCard({
  trigger, children, className,
}: { trigger: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <span data-slot="hover-card" className={cn("group relative inline-flex", className)}>
      <span className="cursor-pointer text-accent-amber underline decoration-accent-amber/40 underline-offset-4 transition-colors hover:decoration-accent-amber">
        {trigger}
      </span>
      <span
        className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-[85] w-72 -translate-x-1/2 rounded-xl border border-border bg-card p-4 opacity-0 shadow-[0_0_40px_-14px_var(--accent-amber)] transition-all duration-200 group-hover:opacity-100"
      >
        {children}
      </span>
    </span>
  )
}
