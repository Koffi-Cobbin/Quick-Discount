import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Loader2, Filter, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function DiscountsPage() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const filteredProducts = selectedCategory
    ? products?.filter((p) => p.categoryId === selectedCategory)
    : products;

  // Split categories into visible and hidden for the dropdown
  const maxVisibleCategories = 4;
  const visibleCategories = categories?.slice(0, maxVisibleCategories) || [];
  const hiddenCategories = categories?.slice(maxVisibleCategories) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground font-medium">
            <Filter className="w-4 h-4" />
            <span>Filter by Category:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge 
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5 rounded-full text-sm transition-all hover-elevate"
              onClick={() => setSelectedCategory(null)}
            >
              All Deals
            </Badge>
            {visibleCategories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="cursor-pointer px-4 py-1.5 rounded-full text-sm transition-all hover-elevate"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}

            {hiddenCategories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full px-4 h-8 gap-1 hover-elevate"
                  >
                    More <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {hiddenCategories.map((category) => (
                    <DropdownMenuItem 
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={selectedCategory === category.id ? "bg-primary text-primary-foreground" : ""}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <SectionHeader 
          title="All Discounts" 
          description={selectedCategory 
            ? `Showing ${categories?.find(c => c.id === selectedCategory)?.name} deals` 
            : "Browse all active deals and coupons"}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {filteredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
