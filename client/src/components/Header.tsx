import { Link } from "wouter";
import { Search, Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/discounts", label: "Discounts" },
    { href: "/help", label: "Help" },
    { href: "/post-discount", label: "Post Ad" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="font-display font-black text-2xl tracking-tighter hover:opacity-90 transition-opacity flex items-center gap-2">
          <div className="bg-white text-primary p-1.5 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline">Quick Discount</span>
          <span className="sm:hidden">QD</span>
        </Link>

        {/* Mobile Search & Menu Controls */}
        <div className="flex items-center gap-1 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-10 w-10">
                <Search className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-32">
              <SheetHeader>
                <SheetTitle className="text-left">Search</SheetTitle>
              </SheetHeader>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for anything..."
                  className="w-full pl-9 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-10 w-10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background text-foreground">
              <SheetHeader>
                <SheetTitle className="font-display font-bold text-2xl text-primary text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium hover:text-primary transition-colors px-2 py-1">
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                {user ? (
                  <>
                    <div className="px-2 py-1 text-muted-foreground">Signed in as {user.email}</div>
                    <Button onClick={() => logout()} variant="destructive" className="w-full">
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link href="/auth" className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90">Sign Up / Login</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Controls (Search and Nav) */}
        <div className="hidden md:flex items-center gap-4 flex-1">
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative group w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for restaurants, hotels, fashion..."
                className="w-full pl-9 pr-4 py-2 rounded-full bg-white/95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <nav className="flex items-center gap-6 font-medium text-sm">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-secondary transition-colors">
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-primary-foreground/80">Hi, {user.firstName || 'User'}</span>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => logout()}
                  className="rounded-full px-6 font-bold shadow-lg shadow-black/10"
                >
                  Logout
                </Button>
              </div>
            ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="secondary" size="sm" className="rounded-full px-6 font-bold shadow-lg shadow-black/10">
                  Sign Up
                </Button>
              </Link>
            </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
