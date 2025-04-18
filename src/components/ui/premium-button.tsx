import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // New premium variants
        ocean: "bg-deep-ocean text-white shadow-md hover:bg-deep-ocean-600 transition-all duration-300",
        sage: "bg-sage text-white shadow-md hover:bg-sage-600 transition-all duration-300",
        terracotta: "bg-terracotta text-white shadow-md hover:bg-terracotta-600 transition-all duration-300",
        lavender: "bg-lavender text-white shadow-md hover:bg-lavender-600 transition-all duration-300",
        gold: "bg-gold text-deep-ocean-900 shadow-md hover:bg-gold-600 transition-all duration-300",
        // Gradient variants
        "gradient-primary": "bg-gradient-primary text-white shadow-md hover:shadow-lg transition-all duration-300",
        "gradient-secondary": "bg-gradient-secondary text-white shadow-md hover:shadow-lg transition-all duration-300",
        "gradient-accent": "bg-gradient-accent text-white shadow-md hover:shadow-lg transition-all duration-300",
        "gradient-calm": "bg-gradient-calm text-white shadow-md hover:shadow-lg transition-all duration-300",
        "gradient-warm": "bg-gradient-warm text-white shadow-md hover:shadow-lg transition-all duration-300",
        "gradient-natural": "bg-gradient-natural text-white shadow-md hover:shadow-lg transition-all duration-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
      animation: {
        none: "",
        pulse: "animate-pulse-slow",
        bounce: "animate-bounce-gentle",
        glow: "animate-pulse-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
PremiumButton.displayName = "PremiumButton";

export { PremiumButton, buttonVariants };