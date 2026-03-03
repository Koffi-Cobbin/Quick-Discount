import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface SectionHeaderProps {
  title: string;
  href?: string;
  description?: string;
}

export function SectionHeader({ title, href, description }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6 px-1">
      <div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary transition-colors group">
          View All 
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
