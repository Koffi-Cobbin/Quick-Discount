import { useRoute } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";
  
  // Mapping slugs to IDs (in a real app, backend would handle slug lookup or we fetch category first)
  const categoryMap: Record<string, number> = {
    'restaurants': 1,
    'fashion': 2,
    'electronics': 3,
    'hotels': 4,
    'food': 1
  };

  const categoryId = categoryMap[slug];
  const { data: products, isLoading } = useProducts({ categoryId });

  // Capitalize slug for title
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 text-center">
          <h1 className="font-display font-black text-4xl md:text-5xl mb-4 text-primary">{title} Deals</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the best discounts in {title}. Updated daily with verified offers.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                No products found in this category yet.
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
