import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-[76px] w-full resize-y rounded-md border border-border bg-card px-3 py-2 font-mono text-[13px] leading-relaxed text-foreground",
        "outline-none transition-all duration-200 placeholder:text-muted-foreground/60",
        "focus-visible:border-accent-amber/60 focus-visible:shadow-[0_0_20px_-8px_var(--accent-amber)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
