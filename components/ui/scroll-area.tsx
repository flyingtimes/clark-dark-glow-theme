import * as React from "react"
import { cn } from "@/lib/utils"

/** 自定义滚动区域：细琥珀滚动条（webkit + firefox 双兼容） */
function ScrollArea({
  children, height = 200, className,
}: { children: React.ReactNode; height?: number; className?: string }) {
  return (
    <div
      data-slot="scroll-area"
      className={cn(
        "overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:var(--accent-amber)_transparent]",
        "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-amber/40",
        "[&::-webkit-scrollbar-thumb:hover]:bg-accent-amber/60",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        className
      )}
      style={{ height }}
    >
      {children}
    </div>
  )
}

export { ScrollArea }
