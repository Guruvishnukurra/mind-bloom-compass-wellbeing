import * as React from "react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'ocean' | 'sage' | 'terracotta' | 'lavender' | 'gold';
  pattern?: 'none' | 'waves' | 'leaves' | 'mountains' | 'dots';
  elevation?: 'flat' | 'raised' | 'floating';
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant = 'default', pattern = 'none', elevation = 'raised', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-card text-card-foreground',
      ocean: 'bg-gradient-to-br from-primary/80 to-primary text-primary-foreground',
      sage: 'bg-gradient-to-br from-secondary/80 to-secondary text-secondary-foreground',
      terracotta: 'bg-gradient-to-br from-accent/80 to-accent text-accent-foreground',
      lavender: 'bg-gradient-to-br from-muted/80 to-muted text-muted-foreground',
      gold: 'bg-gradient-to-br from-primary/20 to-primary/40 text-primary-foreground',
    };

    const patternStyles = {
      none: '',
      waves: 'bg-pattern-waves bg-repeat-x bg-bottom',
      leaves: 'bg-pattern-leaves bg-repeat bg-center',
      mountains: 'bg-pattern-mountains bg-repeat-x bg-bottom',
      dots: 'bg-pattern-dots bg-[length:20px_20px]',
    };

    const elevationStyles = {
      flat: 'border border-border',
      raised: 'border border-border shadow-sm',
      floating: 'border border-border shadow-md hover:shadow-lg transition-shadow duration-300',
    };

    return (
      <Card
        ref={ref}
        className={cn(
          variantStyles[variant],
          patternStyles[pattern],
          elevationStyles[elevation],
          'overflow-hidden',
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';

// Re-export Card subcomponents for convenience
export { PremiumCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };