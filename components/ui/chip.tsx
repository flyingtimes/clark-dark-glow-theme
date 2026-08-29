import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider",
  {
    variants: {
      tone: {
        neutral: "border-border text-muted-foreground",
        amber: "border-accent-amber/45 bg-accent-amber/10 text-accent-amber",
        violet: "border-accent-violet/45 bg-accent-violet/10 text-accent-violet",
        teal: "border-accent-teal/45 bg-accent-teal/10 text-accent-teal",
        green: "border-accent-green/45 bg-accent-green/10 text-accent-green",
        red: "border-accent-red/45 bg-accent-red/10 text-accent-red",
      },
      dashed: { true: "border-dashed", false: "" },
    },
    defaultVariants: { tone: "neutral", dashed: false },
  }
)

export type ChipProps = React.ComponentProps<"span"> & VariantProps<typeof chipVariants>

/** 依赖 globals.css 中的 --accent-* token（见 styles/clone-ui-tokens.css） */
export function Chip({ className, tone, dashed, ...props }: ChipProps) {
  return <span className={cn(chipVariants({ tone, dashed }), className)} {...props} />
}
