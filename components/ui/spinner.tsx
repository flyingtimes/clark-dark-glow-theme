import * as React from "react"
import { cn } from "@/lib/utils"

function Spinner({ size = 16, className, ...props }: React.ComponentProps<"span"> & { size?: number }) {
  return (
    <span
      data-slot="spinner"
      role="status"
      aria-label="加载中"
      style={{ width: size, height: size }}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-accent-amber/25 border-t-accent-amber",
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
