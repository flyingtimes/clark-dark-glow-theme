import * as React from "react"
import { cn } from "@/lib/utils"

function Separator({
  label,
  className,
  ...props
}: React.ComponentProps<"div"> & { label?: string }) {
  if (label) {
    return (
      <div
        data-slot="separator"
        className={cn("flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", className)}
        {...props}
      >
        <span className="h-px flex-1 bg-border" />
        {label}
        <span className="h-px flex-1 bg-border" />
      </div>
    )
  }
  return (
    <div
      data-slot="separator"
      role="separator"
      className={cn("h-px w-full bg-border", className)}
      {...props}
    />
  )
}

export { Separator }
