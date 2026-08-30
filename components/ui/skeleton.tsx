import * as React from "react"
import { cn } from "@/lib/utils"

/** 骨架占位：呼吸脉动 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent-amber/8", className)}
      {...props}
    />
  )
}

export { Skeleton }
