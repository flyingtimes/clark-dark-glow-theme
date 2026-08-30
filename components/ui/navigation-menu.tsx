import * as React from "react"
import { cn } from "@/lib/utils"

type NavItem = { label: string; href?: string; active?: boolean }

function NavigationMenu({ items, className }: { items: NavItem[]; className?: string }) {
  return (
    <nav data-slot="navigation-menu" className={cn("inline-flex items-center gap-6 font-mono text-[12px]", className)}>
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href ?? "#"}
          aria-current={it.active ? "page" : undefined}
          className={cn(
            "relative py-1 transition-colors",
            it.active ? "text-accent-amber" : "text-muted-foreground hover:text-foreground",
            "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-accent-amber after:shadow-[0_0_8px_var(--accent-amber)] after:transition-all after:duration-300",
            it.active ? "after:w-full" : "after:w-0 hover:after:w-full"
          )}
        >
          {it.label}
        </a>
      ))}
    </nav>
  )
}

export { NavigationMenu }
