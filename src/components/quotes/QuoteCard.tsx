import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface QuoteCardProps {
  text: string;
  author: string;
}

export function QuoteCard({ text, author }: QuoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden p-6 bg-card">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/quote-pattern.svg')] opacity-5" />
        <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
        <div className="relative z-10">
          <p className="text-lg md:text-xl font-medium text-foreground mb-4 italic">
            "{text}"
          </p>
          <p className="text-sm text-muted-foreground">— {author}</p>
        </div>
      </Card>
    </motion.div>
  );
} 