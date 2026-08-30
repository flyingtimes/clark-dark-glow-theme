"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

/** 模态对话框：琥珀辉光 + 遮罩 + Esc 关闭 */
export function Dialog({ open, onOpenChange, title, description, children, footer, className }: DialogProps) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])
  if (!open) return null
  return (
    <div data-slot="dialog" className="fixed inset-0 z-[120] grid place-items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={() => onOpenChange(false)} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn("relative w-[92vw] max-w-lg rounded-xl border border-accent-amber/40 bg-card p-6 shadow-[0_0_60px_-18px_var(--accent-amber)]", className)}
      >
        {title && <h3 className="text-[15px] font-bold">{title}</h3>}
        {description && <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-5 flex justify-end gap-2">
          {footer ?? (
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>关闭</Button>
          )}
        </div>
      </div>
    </div>
  )
}
