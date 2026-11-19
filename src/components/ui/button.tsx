import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "border-[3px] border-ink bg-ink text-white shadow-[3px_3px_0_0_#F9B825] hover:bg-ink-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_#F9B825] dark:border-sun-400",
        destructive: "border-[3px] border-ink bg-red-600 text-white shadow-[3px_3px_0_0_#0E2F33] hover:bg-red-700",
        outline: "border-[3px] border-ink bg-white text-ink shadow-[3px_3px_0_0_rgba(14,47,51,0.25)] hover:bg-sun-50 dark:bg-card",
        secondary: "border-[3px] border-ink bg-sun-300 text-ink shadow-[3px_3px_0_0_#0E2F33] hover:bg-sun-400",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-brand-600 underline-offset-4 hover:underline",
        brand: "border-[3px] border-ink bg-brand-600 text-white shadow-[4px_4px_0_0_#0E2F33] hover:bg-brand-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#0E2F33]",
        leaf: "border-[3px] border-ink bg-leaf-600 text-white shadow-[4px_4px_0_0_#0E2F33] hover:bg-leaf-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#0E2F33]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
