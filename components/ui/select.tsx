import * as React from "react"
import { cn } from "@/lib/utils"

/** 原生 select 的终端风包装：外观统一 + 焦点辉光 */
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div data-slot="select-wrapper" className="relative w-full">
      <select
        data-slot="select"
        className={cn(
          "h-9 w-full cursor-pointer appearance-none rounded-md border border-border bg-card px-3 pr-8 font-mono text-[13px] text-foreground",
          "outline-none transition-all duration-200",
          "focus-visible:border-accent-amber/60 focus-visible:shadow-[0_0_20px_-8px_var(--accent-amber)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground"
      >
        ▼
      </span>
    </div>
  )
}

export { Select }
