import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide",
  {
    variants: {
      variant: {
        default: "border-accent-amber/50 bg-accent-amber/12 text-accent-amber shadow-[0_0_12px_-6px_var(--accent-amber)]",
        secondary: "border-border bg-card text-muted-foreground",
        outline: "border-border text-foreground",
        destructive: "border-accent-red/50 bg-accent-red/12 text-accent-red",
        teal: "border-accent-teal/50 bg-accent-teal/12 text-accent-teal",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
