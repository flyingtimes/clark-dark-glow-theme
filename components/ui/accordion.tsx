"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** 手风琴：grid-rows 过渡展开，+ 号旋转为 × */
export function AccordionItem({
  title, children, defaultOpen = false, className,
}: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div data-slot="accordion-item" className={cn("border-b border-border", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-mono text-[13px] transition-colors hover:text-accent-amber"
      >
        {title}
        <span className={cn("text-muted-foreground transition-transform duration-300", open && "rotate-45 text-accent-amber")}>+</span>
      </button>
      <div
        data-state={open ? "open" : "closed"}
        className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="overflow-hidden">
          <div className="pb-4 text-[12px] leading-relaxed text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div data-slot="accordion" className={cn("w-full", className)}>{children}</div>
}
