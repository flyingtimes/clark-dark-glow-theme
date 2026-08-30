"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Toggle } from "@/components/ui/toggle"

type ToggleGroupProps = {
  type?: "single" | "multiple"
  items: { value: string; label: React.ReactNode }[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  className?: string
}

/** 切换组：single 单选 / multiple 多选 */
function ToggleGroup({ type = "single", items, value: controlled, defaultValue, onChange, className }: ToggleGroupProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? (type === "single" ? [items[0]?.value].filter(Boolean) : []))
  const value = controlled ?? internal
  const toggle = (v: string) => {
    let next: string[]
    if (type === "single") next = value.includes(v) && value.length === 1 ? value : [v]
    else next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v]
    setInternal(next)
    onChange?.(next)
  }
  return (
    <div data-slot="toggle-group" role="group" className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((it) => {
        const on = value.includes(it.value)
        return (
          <Toggle key={it.value} pressed={on} onPressedChange={() => toggle(it.value)}>
            {it.label}
          </Toggle>
        )
      })}
    </div>
  )
}

export { ToggleGroup }
