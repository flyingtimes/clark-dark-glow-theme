"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type RadioGroupProps = {
  options: { value: string; label: React.ReactNode }[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  className?: string
}

/** 单选组：圆环 + 内点辉光（role=radio，键盘可选） */
function RadioGroup({ options, value: controlled, defaultValue, onChange, name, className }: RadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value)
  const value = controlled ?? internal
  const pick = (v: string) => { setInternal(v); onChange?.(v) }

  return (
    <div role="radiogroup" data-slot="radio-group" className={cn("flex flex-wrap gap-4", className)} {...(name ? { "aria-label": name } : {})}>
      {options.map((opt) => {
        const on = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => pick(opt.value)}
            className={cn("flex cursor-pointer items-center gap-2.5 font-mono text-[12px] transition-colors", on ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <span
              style={on ? { borderColor: "var(--accent-amber)", boxShadow: "0 0 12px -4px var(--accent-amber)" } : undefined}
              className={cn(
                "grid size-4 place-items-center rounded-full border transition-all duration-150",
                on ? "border-accent-amber" : "border-border bg-card hover:border-accent-amber/40"
              )}
            >
              <span className={cn("size-2 rounded-full bg-accent-amber shadow-[0_0_6px_var(--accent-amber)] transition-opacity", on ? "opacity-100" : "opacity-0")} />
            </span>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export { RadioGroup }
