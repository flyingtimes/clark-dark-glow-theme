"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ToggleProps = React.ComponentProps<"button"> & {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

/** 按压式切换钮：按下 = 琥珀辉光态 */
function Toggle({ className, pressed: controlled, defaultPressed = false, onPressedChange, children, ...props }: ToggleProps) {
  const [internal, setInternal] = React.useState(defaultPressed)
  const on = controlled ?? internal
  const click = () => {
    const next = !on
    setInternal(next)
    onPressedChange?.(next)
  }
  return (
    <button
      type="button"
      aria-pressed={on}
      data-state={on ? "on" : "off"}
      data-slot="toggle"
      onClick={click}
      className={cn(
        "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 font-mono text-[12px] transition-all duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent-amber/40",
        on
          ? "border-accent-amber/60 bg-accent-amber/12 text-accent-amber shadow-[0_0_18px_-8px_var(--accent-amber)]"
          : "border-border text-muted-foreground hover:border-accent-amber/40 hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { Toggle }
