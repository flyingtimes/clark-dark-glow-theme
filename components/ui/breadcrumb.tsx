import * as React from "react"
import { cn } from "@/lib/utils"

type Crumb = { label: React.ReactNode; href?: string }

function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav data-slot="breadcrumb" aria-label="breadcrumb" className={cn("flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-muted-foreground", className)}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-muted-foreground/50">/</span>}
          {i === items.length - 1
            ? <span aria-current="page" className="text-accent-amber">{it.label}</span>
            : <a href={it.href ?? "#"} className="transition-colors hover:text-foreground">{it.label}</a>}
        </React.Fragment>
      ))}
    </nav>
  )
}

export { Breadcrumb }
