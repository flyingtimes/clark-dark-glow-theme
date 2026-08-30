"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

type DatePickerProps = {
  value?: Date | null
  onChange?: (d: Date) => void
  placeholder?: string
  className?: string
}

/** 日期选择器：只读输入框 + 日历弹出层 */
function DatePicker({ value, onChange, placeholder = "选择日期", className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | null>(value ?? null)
  const boxRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  const pick = (d: Date) => {
    setDate(d); setOpen(false); onChange?.(d)
  }
  const text = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : ""

  return (
    <div ref={boxRef} data-slot="date-picker" className={cn("relative w-full", className)}>
      <Input readOnly value={text} placeholder={placeholder} onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)} className="cursor-pointer" />
      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[80] shadow-[0_0_40px_-14px_var(--accent-amber)]">
          <Calendar value={date} onChange={pick} />
        </div>
      )}
    </div>
  )
}

export { DatePicker }
