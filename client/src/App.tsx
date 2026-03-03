import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductDetails from "@/pages/ProductDetails";
import CategoryPage from "@/pages/CategoryPage";
import DiscountsPage from "@/pages/DiscountsPage";
import AuthPage from "@/pages/AuthPage";
import PostDiscountPage from "@/pages/PostDiscountPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/discounts" component={DiscountsPage} />
      <Route path="/post-discount" component={PostDiscountPage} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/category/:slug" component={CategoryPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
