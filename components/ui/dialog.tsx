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

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'

/** 模态对话框：琥珀辉光 + 遮罩 + Esc 关闭 + Tab 焦点陷阱 + 关闭后焦点还原 */
export function Dialog({ open, onOpenChange, title, description, children, footer, className }: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const prevFocus = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!open) return
    prevFocus.current = document.activeElement as HTMLElement
    const focusables = () =>
      panelRef.current
        ? Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => !n.hasAttribute("disabled"))
        : []
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onOpenChange(false); return }
      if (e.key !== "Tab") return
      const list = focusables()
      if (!list.length) return
      const first = list[0], last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      prevFocus.current?.focus()   // 焦点还原到触发器
    }
  }, [open, onOpenChange])

  if (!open) return null
  return (
    <div data-slot="dialog" className="fixed inset-0 z-[120] grid place-items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={() => onOpenChange(false)} />
      <div
        ref={panelRef}
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
