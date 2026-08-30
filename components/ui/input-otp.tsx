"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** 6 位 OTP 输入：数字自动前进、退格回退、支持整段粘贴、中缝分隔、填满触发 onComplete */
function InputOTP({
  length = 6, onComplete, className,
}: { length?: number; onComplete?: (code: string) => void; className?: string }) {
  const [vals, setVals] = React.useState<string[]>(Array(length).fill(""))
  const refs = React.useRef<(HTMLInputElement | null)[]>([])

  const setAt = (i: number, ch: string) => {
    const next = [...vals]
    next[i] = ch
    setVals(next)
    if (ch && i < length - 1) refs.current[i + 1]?.focus()
    if (next.every((v) => v !== "")) onComplete?.(next.join(""))
  }

  /** 整段粘贴：从第 0 位起依次分发数字 */
  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length).split("")
    if (!digits.length) return
    const next = Array.from({ length }, (_, i) => digits[i] ?? "")
    setVals(next)
    refs.current[Math.min(digits.length, length - 1)]?.focus()
    if (next.every((v) => v !== "")) onComplete?.(next.join(""))
  }

  const mid = Math.floor(length / 2)   // 中缝分隔：第 length/2 位之后

  return (
    <div data-slot="input-otp" className={cn("flex items-center gap-2", className)} onPaste={onPaste}>
      {vals.map((v, i) => (
        <React.Fragment key={i}>
          {i === mid && <span aria-hidden className="h-px w-3 bg-border" />}
          <input
            ref={(n) => { refs.current[i] = n }}
            value={v}
            inputMode="numeric"
            maxLength={1}
            aria-label={`第 ${i + 1} 位`}
            onChange={(e) => setAt(i, e.target.value.replace(/\D/g, "").slice(-1))}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !vals[i] && i > 0) refs.current[i - 1]?.focus()
            }}
            className={cn(
              "size-11 rounded-lg border bg-card text-center font-mono text-[18px] font-bold outline-none transition-all duration-200",
              v
                ? "border-accent-amber/60 text-accent-amber shadow-[0_0_16px_-7px_var(--accent-amber)]"
                : "border-border text-foreground focus-visible:border-accent-amber/60 focus-visible:shadow-[0_0_16px_-7px_var(--accent-amber)]"
            )}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export { InputOTP }
