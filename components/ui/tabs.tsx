"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type TabsContextValue = { value: string; set: (v: string) => void }
const TabsContext = React.createContext<TabsContextValue | null>(null)

function Tabs({
  defaultValue = "",
  value: controlled,
  onValueChange,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultValue?: string
  value?: string
  onValueChange?: (v: string) => void
}) {
  const [internal, setInternal] = React.useState(defaultValue)
  const value = controlled ?? internal
  const set = (v: string) => {
    setInternal(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value, set }}>
      <div data-slot="tabs" className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      className={cn("inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1", className)}
      {...props}
    />
  )
}

function TabsTrigger({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { value: string }) {
  const ctx = React.useContext(TabsContext)
  const active = ctx?.value === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-state={active ? "active" : "inactive"}
      data-slot="tabs-trigger"
      onClick={() => ctx?.set(value)}
      className={cn(
        "cursor-pointer rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent-amber/40",
        active
          ? "border border-accent-amber/50 bg-accent-amber/10 text-accent-amber shadow-[0_0_16px_-8px_var(--accent-amber)]"
          : "border border-transparent text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const ctx = React.useContext(TabsContext)
  if (ctx?.value !== value) return null
  return (
    <div
      role="tabpanel"
      data-slot="tabs-content"
      className={cn("mt-3 rounded-lg border border-border bg-card p-4 font-mono text-[12px] leading-relaxed text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
