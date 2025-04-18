import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'ocean' | 'sage' | 'terracotta' | 'lavender' | 'gold';
  pattern?: 'none' | 'waves' | 'leaves' | 'mountains' | 'dots';
  elevation?: 'flat' | 'raised' | 'floating';
  children: React.ReactNode;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant = 'default', pattern = 'none', elevation = 'raised', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-card text-card-foreground',
      ocean: 'bg-gradient-to-br from-deep-ocean-400 to-deep-ocean-600 text-white',
      sage: 'bg-gradient-to-br from-sage-400 to-sage-600 text-white',
      terracotta: 'bg-gradient-to-br from-terracotta-400 to-terracotta-600 text-white',
      lavender: 'bg-gradient-to-br from-lavender-400 to-lavender-600 text-white',
      gold: 'bg-gradient-to-br from-gold-400 to-gold-600 text-deep-ocean-900',
    };

    const patternStyles = {
      none: '',
      waves: 'bg-pattern-waves bg-repeat-x bg-bottom',
      leaves: 'bg-pattern-leaves bg-repeat bg-center',
      mountains: 'bg-pattern-mountains bg-repeat-x bg-bottom',
      dots: 'bg-pattern-dots bg-[length:20px_20px]',
    };

    const elevationStyles = {
      flat: 'border',
      raised: 'border shadow-md',
      floating: 'border shadow-lg hover:shadow-xl transition-shadow duration-300',
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