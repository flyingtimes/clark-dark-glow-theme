import * as React from "react"
import { cn } from "@/lib/utils"

function AspectRatio({
  ratio = 16 / 9, className, children, ...props
}: React.ComponentProps<"div"> & { ratio?: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ aspectRatio: String(ratio) }}
      className={cn("overflow-hidden rounded-lg border border-border bg-card", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { AspectRatio }
