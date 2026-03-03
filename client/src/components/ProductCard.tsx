import { Star } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <motion.div 
        whileHover={{ 
          y: -8,
          transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] }
        }}
        className="group relative h-full bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-shadow duration-300"
      >
        {/* Discount Badge */}
        {product.discountPercentage && (
          <div className="absolute top-3 left-3 z-10 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-secondary/20 animate-pulse">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Image */}
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700 text-xs font-bold shrink-0">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground font-medium truncate">
            {product.merchantName}
          </p>

          <div className="mt-auto pt-2 flex items-baseline gap-2">
            <span className="font-display font-bold text-xl text-primary">
              ${product.discountPrice}
            </span>
            {product.price && (
              <span className="text-sm text-muted-foreground line-through decoration-destructive/50 decoration-2">
                ${product.price}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
