import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

export default function ShoppingPage() {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16 space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Shopping Page
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse all eyewear products here. You can continue wiring catalog,
          filters, and checkout flow on this page.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </section>
  );
}
