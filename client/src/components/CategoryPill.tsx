import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface CategoryPillProps {
  name: string;
  slug: string;
  isActive?: boolean;
}

export function CategoryPill({ name, slug, isActive }: CategoryPillProps) {
  return (
    <Link href={`/category/${slug}`}>
      <button 
        className={cn(
          "whitespace-nowrap px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300",
          isActive 
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
            : "bg-white border border-border text-muted-foreground hover:border-primary hover:text-primary hover:shadow-md"
        )}
      >
        {name}
      </button>
    </Link>
  );
}
