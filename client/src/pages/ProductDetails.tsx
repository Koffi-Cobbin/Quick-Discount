import { useProduct } from "@/hooks/use-products";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, Share2, Heart, ShieldCheck, Clock, Star, Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export default function ProductDetails() {
  const [match, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: product, isLoading, error } = useProduct(id);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedCode, setClaimedCode] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Product not found
      </div>
    );
  }

  const handleClaim = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please login to claim this offer.",
        variant: "destructive",
      });
      return;
    }
    
    setIsClaiming(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      setClaimedCode(mockCode);
      setIsClaiming(false);
      toast({
        title: "Offer Claimed!",
        description: "Your unique coupon code has been generated.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted relative group shadow-2xl shadow-primary/5">
              <img 
                src={product.imageUrl} 
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.discountPercentage && (
                <div className="absolute top-6 left-6 bg-secondary text-secondary-foreground text-lg font-bold px-4 py-2 rounded-full shadow-lg">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </div>
            {/* Thumbnails placeholder - would map array of images here */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <img src={product.imageUrl} className="w-full h-full object-cover opacity-70 hover:opacity-100" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-4 text-sm text-primary font-bold tracking-wider uppercase">
                {product.merchantName}
              </div>
              <h1 className="font-display font-black text-4xl md:text-5xl text-foreground leading-tight mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star className="w-5 h-5 fill-current" />
                  {product.rating} <span className="text-muted-foreground font-normal">({product.reviewCount} reviews)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Valid until Dec 31
                </div>
              </div>

              <div className="flex items-end gap-4 mb-8">
                <span className="font-display font-black text-5xl text-primary">
                  ${product.discountPrice}
                </span>
                {product.price && (
                  <span className="text-xl text-muted-foreground line-through decoration-2 mb-2">
                    ${product.price}
                  </span>
                )}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {product.description || "Experience premium quality services and products with this exclusive limited-time offer. Verified by Quick Discount team for authenticity."}
              </p>

              <div className="flex flex-col gap-4 mb-8">
                <AnimatePresence mode="wait">
                  {!claimedCode ? (
                    <motion.div
                      key="claim-button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <Button 
                        onClick={handleClaim} 
                        size="lg" 
                        disabled={isClaiming}
                        className="flex-1 h-14 rounded-full text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                      >
                        {isClaiming ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Claiming...</>
                        ) : (
                          "Claim Offer Now"
                        )}
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-2">
                          <Heart className="w-6 h-6" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-2">
                          <Share2 className="w-6 h-6" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="coupon-code"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center space-y-4"
                    >
                      <div className="flex items-center justify-center gap-2 text-primary font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        Offer Claimed Successfully!
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Your Coupon Code</span>
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border shadow-sm group">
                          <span className="font-mono text-2xl font-black tracking-wider text-foreground">{claimedCode}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard(claimedCode)}
                            className="h-8 w-8 hover:bg-primary/10"
                          >
                            <Copy className="w-4 h-4 text-primary" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Present this code at checkout to redeem your discount.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 border border-border space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground">Verified Merchant</h4>
                    <p className="text-sm text-muted-foreground">This offer is verified valid by our team.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
