import * as React from "react"
import { cn } from "@/lib/utils"

/** 排版组件：统一暗黑辉光主题下的文字层级 */
function Typography({
  variant = "body", className, children,
}: { variant?: "h1" | "h2" | "h3" | "h4" | "lead" | "body" | "muted" | "quote" | "list" | "code"; className?: string; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    h1: "font-mono text-[28px] font-bold leading-tight",
    h2: "font-mono text-[20px] font-bold leading-snug",
    h3: "font-mono text-[16px] font-bold leading-snug",
    h4: "font-mono text-[14px] font-bold tracking-wide",
    lead: "text-[15px] leading-relaxed text-foreground",
    body: "text-[13px] leading-loose text-foreground",
    muted: "text-[12px] leading-relaxed text-muted-foreground",
    quote: "border-l-2 border-accent-amber/60 bg-accent-amber/5 py-2 pl-4 text-[13px] italic leading-relaxed text-muted-foreground",
    list: "list-disc pl-5 text-[13px] leading-loose text-foreground marker:text-accent-amber",
    code: "rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-[12px] text-accent-amber",
  }
  return <div data-slot={`typography-${variant}`} className={cn(styles[variant], className)}>{children}</div>
}

export { Typography }
