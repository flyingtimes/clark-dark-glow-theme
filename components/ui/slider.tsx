import * as React from "react"
import { cn } from "@/lib/utils"

/** 原生 range + accent token（跨端行为最稳；需要自定义轨道时再上 Radix Slider） */
function Slider({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="range"
      data-slot="slider"
      className={cn("h-1.5 w-full cursor-pointer", className)}
      style={{ accentColor: "var(--accent-amber)" }}
      {...props}
    />
  )
}

export { Slider }
