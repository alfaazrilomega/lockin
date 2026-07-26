// Tremor Raw Badge - Light Mode Only
import React from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cx } from "@/lib/utils"

const badgeVariants = tv({
  base: cx(
    "inline-flex items-center gap-x-1 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold ring-1",
  ),
  variants: {
    variant: {
      default: "bg-indigo-50 text-indigo-800 ring-indigo-500/30",
      neutral: "bg-gray-50 text-gray-700 ring-gray-500/30",
      success: "bg-emerald-50 text-emerald-800 ring-emerald-600/30",
      error: "bg-red-50 text-red-800 ring-red-600/20",
      warning: "bg-yellow-50 text-yellow-800 ring-yellow-600/30",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface BadgeProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }: BadgeProps, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        className={cx(badgeVariants({ variant }), className)}
        {...props}
      />
    )
  },
)

Badge.displayName = "Badge"

export { Badge, badgeVariants, type BadgeProps }
