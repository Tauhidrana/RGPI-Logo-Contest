import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        blue: "border-transparent bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
        green: "border-transparent bg-leaf-100 text-leaf-700 dark:bg-leaf-900/40 dark:text-leaf-200",
        amber: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
        violet: "border-transparent bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
        red: "border-transparent bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
        emerald: "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
        teal: "border-transparent bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { Badge, badgeVariants };
