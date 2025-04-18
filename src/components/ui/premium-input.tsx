import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "ocean" | "sage" | "terracotta" | "lavender" | "gold";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const PremiumInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", icon, iconPosition = "left", ...props }, ref) => {
    const variantStyles = {
      default: "border-input bg-background focus:border-primary",
      ocean: "border-deep-ocean-200 bg-deep-ocean-50 focus:border-deep-ocean",
      sage: "border-sage-200 bg-sage-50 focus:border-sage",
      terracotta: "border-terracotta-200 bg-terracotta-50 focus:border-terracotta",
      lavender: "border-lavender-200 bg-lavender-50 focus:border-lavender",
      gold: "border-gold-200 bg-gold-50 focus:border-gold",
    };

    const inputClasses = cn(
      "flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      variantStyles[variant],
      icon ? (iconPosition === "left" ? "pl-9" : "pr-9") : "",
      className
    );

    if (icon) {
      return (
        <div className="relative">
          <span className={`absolute ${iconPosition === 'left' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-muted-foreground`}>
            {icon}
          </span>
          <input type={type} className={inputClasses} ref={ref} {...props} />
        </div>
      );
    }

    return <input type={type} className={inputClasses} ref={ref} {...props} />;
  }
);

PremiumInput.displayName = "PremiumInput";

export { PremiumInput };