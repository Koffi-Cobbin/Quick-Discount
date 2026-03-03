import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryPill } from "@/components/CategoryPill";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

export default function Home() {
  const { data: products, isLoading: productsLoading } = useProducts({ isFeatured: true });
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  // Carousel ref
  const [emblaRef] = useEmblaCarousel({ 
    loop: false, 
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps"
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  // Group products by category (simulated for demo if backend doesn't filter perfectly)
  const restaurantDeals = products?.filter(p => p.categoryId === 1) || [];
  const fashionDeals = products?.filter(p => p.categoryId === 2) || [];
  const electronicsDeals = products?.filter(p => p.categoryId === 3) || [];
  const hotelDeals = products?.filter(p => p.categoryId === 4) || [];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative pt-8 pb-20 overflow-hidden bg-primary text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-background [clip-path:ellipse(60%_100%_at_50%_100%)]"></div>
          
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold text-secondary animate-bounce">
                🎉 Special Summer Sale Live Now
              </div>
              
              <h1 className="font-display font-black text-5xl md:text-7xl tracking-tight leading-none">
                Get Up To <span className="text-secondary drop-shadow-lg">50% OFF</span> <br/>
                On Top Brands
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
                Discover exclusive deals on restaurants, fashion, electronics and more. Verified coupons updated daily.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-primary hover:bg-white/90 font-bold text-lg shadow-xl shadow-black/10 w-full sm:w-auto">
                  Explore Deals
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white hover:border-white w-full sm:w-auto">
                  How it Works
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CATEGORIES PILLS */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 mb-12">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" ref={emblaRef}>
              <div className="flex gap-3 min-w-0 pr-4">
                <CategoryPill name="Popular" slug="popular" isActive />
                <CategoryPill name="For You" slug="for-you" />
                <CategoryPill name="Today's Deals" slug="today" />
                {categories?.map((cat) => (
                  <CategoryPill key={cat.id} name={cat.name} slug={cat.slug} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED / TOP DISCOUNTS GRID */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <SectionHeader 
            title="Top Discounts Today" 
            description="Handpicked deals with the highest savings"
            href="/discounts"
          />
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products?.slice(0, 4).map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* RESTAURANTS CAROUSEL */}
        <section className="bg-orange-50/50 py-16 mb-16 rounded-[3rem]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              title="Hungry? Grab a Bite" 
              description="Best discounts on top rated restaurants"
              href="/category/restaurants"
            />
            
            <div className="overflow-x-auto pb-8 -mx-4 px-4 sm:px-6 lg:px-8 scrollbar-hide flex gap-6 snap-x snap-mandatory">
              {restaurantDeals.length > 0 ? restaurantDeals.map((product) => (
                <div key={product.id} className="w-[calc(100%-2rem)] min-w-[calc(100%-2rem)] md:w-[calc(25%-1.25rem)] md:min-w-[calc(25%-1.25rem)] snap-center">
                  <ProductCard product={product} />
                </div>
              )) : (
                /* Fallback if no specific data */
                <div className="col-span-full text-center py-10 text-muted-foreground w-full">
                  No restaurant deals found at the moment.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FASHION SECTION */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <SectionHeader 
            title="Fashion Trends" 
            href="/category/fashion"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Promo Banner Large */}
            <div className="md:col-span-1 rounded-3xl overflow-hidden relative group h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop" 
                alt="Fashion Sale"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                  SEASON END
                </span>
                <h3 className="font-display font-bold text-3xl mb-2">Summer Collection</h3>
                <p className="text-white/80 mb-6">Up to 70% off on premium brands</p>
                <Button className="w-fit bg-white text-black hover:bg-white/90 rounded-full font-bold">
                  Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Grid of Products */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {fashionDeals.slice(0, 2).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ELECTRONICS GRID */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <SectionHeader 
            title="Electronics & Gadgets" 
            href="/category/electronics"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {electronicsDeals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
