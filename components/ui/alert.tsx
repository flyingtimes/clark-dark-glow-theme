import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "rounded-r-md border-l-2 px-4 py-3 font-mono text-[12px] leading-relaxed",
  {
    variants: {
      tone: {
        neutral: "border-border bg-card text-muted-foreground",
        amber: "border-accent-amber/60 bg-accent-amber/8 text-foreground shadow-[0_0_28px_-14px_var(--accent-amber)]",
        violet: "border-accent-violet/60 bg-accent-violet/8 text-foreground shadow-[0_0_28px_-14px_var(--accent-violet)]",
        teal: "border-accent-teal/60 bg-accent-teal/8 text-foreground shadow-[0_0_28px_-14px_var(--accent-teal)]",
        green: "border-accent-green/60 bg-accent-green/8 text-foreground shadow-[0_0_28px_-14px_var(--accent-green)]",
        red: "border-accent-red/60 bg-accent-red/8 text-foreground shadow-[0_0_28px_-14px_var(--accent-red)]",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
)

const titleTone: Record<string, string> = {
  neutral: "text-foreground",
  amber: "text-accent-amber",
  violet: "text-accent-violet",
  teal: "text-accent-teal",
  green: "text-accent-green",
  red: "text-accent-red",
}

function Alert({
  tone,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      data-slot="alert"
      data-tone={tone}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("mb-1 text-[11px] uppercase tracking-wider", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants, titleTone }
