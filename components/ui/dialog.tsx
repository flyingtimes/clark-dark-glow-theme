"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useFocusTrap } from "@/hooks/use-focus-trap"

type DialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

/**
 * 模态对话框：琥珀辉光 + 遮罩 + Esc 关闭 + 焦点陷阱/还原（useFocusTrap）。
 * 受控：传 open + onOpenChange；非受控：只传 defaultOpen。
 */
export function Dialog({
  open: controlled, defaultOpen = false, onOpenChange, title, description, children, footer, className,
}: DialogProps) {
  const [internal, setInternal] = React.useState(defaultOpen)
  const open = controlled ?? internal
  const change = (o: boolean) => { setInternal(o); onOpenChange?.(o) }
  const panelRef = useFocusTrap<HTMLDivElement>(open, () => change(false))

  if (!open) return null
  return (
    <div data-slot="dialog" className="fixed inset-0 z-[120] grid place-items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={() => change(false)} />
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
            <Button variant="outline" size="sm" onClick={() => change(false)}>关闭</Button>
          )}
        </div>
      </div>
    </div>
  )
}
