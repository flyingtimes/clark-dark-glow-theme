"use client"

import * as React from "react"

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'

/**
 * 模态焦点陷阱：open 时聚焦面板首个可交互元素，Tab 循环限制在面板内，
 * Esc 触发 onEscape，关闭时焦点自动还原到打开前的元素。
 *
 * 用法：const panelRef = useFocusTrap<HTMLDivElement>(open, () => onOpenChange(false))
 *       <div ref={panelRef} role="dialog" aria-modal="true">…</div>
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  open: boolean,
  onEscape?: () => void
) {
  const panelRef = React.useRef<T>(null)
  const prevFocus = React.useRef<HTMLElement | null>(null)
  const escapeRef = React.useRef(onEscape)
  escapeRef.current = onEscape

  React.useEffect(() => {
    if (!open) return
    prevFocus.current = (document.activeElement as HTMLElement) ?? null
    const focusables = () =>
      panelRef.current
        ? Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (n) => !n.hasAttribute("disabled")
          )
        : []
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { escapeRef.current?.(); return }
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
      prevFocus.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return panelRef
}
