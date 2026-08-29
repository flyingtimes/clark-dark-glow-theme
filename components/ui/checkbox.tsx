"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Checkbox({
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
      role="checkbox"
      aria-checked={on}
      data-state={on ? "on" : "off"}
      data-slot="checkbox"
      onClick={toggle}
      className={cn(
        "grid size-[18px] shrink-0 cursor-pointer place-items-center rounded-[5px] border font-mono text-[11px] outline-none transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-accent-amber/40",
        on
          ? "border-accent-amber/60 bg-accent-amber/15 text-accent-amber shadow-[0_0_14px_-6px_var(--accent-amber)]"
          : "border-border bg-card text-transparent hover:border-accent-amber/40",
        className
      )}
      {...props}
    >
      ✓
    </button>
  )
}

export { Checkbox }
