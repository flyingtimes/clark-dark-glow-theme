import * as React from "react"
import { cn } from "@/lib/utils"

/** 纯 CSS 悬停提示（零依赖；复杂定位/受控场景再换 Radix Tooltip） */
function Tooltip({
  label,
  children,
  className,
}: React.ComponentProps<"span"> & { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <span data-slot="tooltip" className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}

export { Tooltip }
