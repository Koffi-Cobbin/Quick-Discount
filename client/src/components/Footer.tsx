import { ShoppingBag, Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20 pt-16 pb-8 rounded-t-[3rem]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="font-display font-black text-2xl tracking-tighter flex items-center gap-2 text-white hover:text-primary transition-colors">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              Quick Discount
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for the best deals, coupons, and discounts from top merchants worldwide.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="bg-white/5 p-2 rounded-full hover:bg-primary hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Discover</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/category/food" className="hover:text-secondary transition-colors">Restaurants</Link></li>
              <li><Link href="/category/fashion" className="hover:text-secondary transition-colors">Fashion</Link></li>
              <li><Link href="/category/electronics" className="hover:text-secondary transition-colors">Electronics</Link></li>
              <li><Link href="/category/hotels" className="hover:text-secondary transition-colors">Hotels</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-secondary transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">Get the latest deals delivered to your inbox.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                placeholder="Enter email" 
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-500"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 Quick Discount Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Quick Discount Team
          </p>
        </div>
      </div>
    </footer>
  );
}
