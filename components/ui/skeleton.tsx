import * as React from "react"
import { cn } from "@/lib/utils"

/** 骨架占位：呼吸脉动（底色按可读性校准到 14%） */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent-amber/14", className)}
      {...props}
    />
  )
}

export { Skeleton }
