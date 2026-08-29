"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Switch({
  className,
  defaultChecked = false,
  checked: controlled,
  onCheckedChange,
  ...props
}: Omit<React.ComponentProps<"button">, "checked" | "onChange"> & {
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  const [internal, setInternal] = React.useState(defaultChecked)
  const on = controlled ?? internal
  const toggle = () => {
    const next = !on
    setInternal(next)
    onCheckedChange?.(next)
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      data-state={on ? "on" : "off"}
      data-slot="switch"
      onClick={toggle}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border outline-none transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-accent-amber/40",
        on
          ? "border-accent-amber/60 bg-accent-amber/15 shadow-[0_0_16px_-6px_var(--accent-amber)]"
          : "border-border bg-card hover:border-accent-amber/30",
        className
      )}
      {...props}
    >
      <span
        data-slot="thumb"
        className={cn(
          "inline-block size-3.5 rounded-full transition-all duration-200",
          on
            ? "translate-x-[18px] bg-accent-amber shadow-[0_0_8px_var(--accent-amber)]"
            : "translate-x-[3px] bg-muted-foreground"
        )}
      />
    </button>
  )
}

export { Switch }
