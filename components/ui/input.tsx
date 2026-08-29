import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full rounded-md border border-border bg-card px-3 font-mono text-[13px] text-foreground",
        "outline-none transition-all duration-200 placeholder:text-muted-foreground/60",
        "focus-visible:border-accent-amber/60 focus-visible:shadow-[0_0_20px_-8px_var(--accent-amber)]",
        "aria-invalid:border-accent-red/60 aria-invalid:shadow-[0_0_20px_-8px_var(--accent-red)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
