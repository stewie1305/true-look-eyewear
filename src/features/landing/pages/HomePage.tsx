import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useNavigate } from "react-router-dom";

import { ArrowRight, Sparkles, Shield, Truck, Star } from "lucide-react";

/* ================= IMPORT IMAGES ================= */

import heroImg from "@/shared/pictures/h3.jpg";
import product1 from "@/shared/pictures/he1.jpg";
import product2 from "@/shared/pictures/h2.jpg";
import product3 from "@/shared/pictures/h4.jpg";

/* ================= DATA ================= */

const products = [
  {
    name: "Classic Black Frame",
    price: "$120",
    image: product1,
  },
  {
    name: "Transparent Frame",
    price: "$140",
    image: product2,
  },
  {
    name: "Round Vintage Frame",
    price: "$160",
    image: product3,
  },
];

const features = [
  {
    title: "Premium Quality",
    description: "Crafted with high quality materials.",
    icon: Sparkles,
  },
  {
    title: "Free Shipping",
    description: "Free delivery on all orders.",
    icon: Truck,
  },
  {
    title: "Warranty",
    description: "2 year official warranty.",
    icon: Shield,
  },
];

/* ================= PAGE ================= */

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* ================= HERO ================= */}

      <section className="bg-background border-b">
        <div className="container mx-auto px-6 py-16 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
          {/* LEFT */}

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground">
              Discover Your{" "}
              <span className="text-primary">Perfect Eyewear</span>
            </h1>

            <p className="text-muted-foreground max-w-lg">
              Premium eyewear crafted for comfort, clarity, and style. Designed
              for modern lifestyle.
            </p>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => navigate("/shopping")}
              >
                Shop Now
                <ArrowRight size={18} />
              </Button>

              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>

            {/* STATS */}

            <div className="flex gap-8 pt-4">
              <Stat number="500+" label="Products" />
              <Stat number="10K+" label="Customers" />
              <Stat number="23" label="Stores" />
            </div>
          </div>

          {/* RIGHT IMAGE — FIXED */}

          <div className="relative w-full aspect-video min-h-72 lg:min-h-96 overflow-hidden rounded-xl">
            <img
              src={heroImg}
              alt="Hero Glasses"
              className="
                w-full h-full
                object-cover
                transition-transform duration-700
                hover:scale-105
              "
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="bg-muted/40">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Why Choose True Look
            </h2>

            <p className="text-muted-foreground">
              Best quality eyewear with premium service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}

      <section className="bg-background">
        <div className="container mx-auto px-6 py-20">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">
              Featured Products
            </h2>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/shopping")}
            >
              View All
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                onAddToCart={() => navigate("/login")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}

      <section className="bg-muted/40">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-10">
            What Our Customers Say
          </h2>

          <div className="max-w-xl mx-auto">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-center gap-1">
                  <Star className="fill-primary text-primary" size={18} />
                  <Star className="fill-primary text-primary" size={18} />
                  <Star className="fill-primary text-primary" size={18} />
                  <Star className="fill-primary text-primary" size={18} />
                  <Star className="fill-primary text-primary" size={18} />
                </div>

                <p className="text-muted-foreground">
                  Amazing quality and fast delivery. Highly recommended!
                </p>

                <div className="font-medium text-foreground">— Minh Hoàng</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}

      <section className="bg-primary">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-md mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold text-primary-foreground">
              Subscribe for Updates
            </h2>

            <p className="text-primary-foreground/80">
              Get updates and special offers.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                placeholder="Enter your email"
                className="
                  flex-1 px-4 py-2 rounded-md border border-border
                  bg-background text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring
                "
              />

              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ number, label }: any) {
  return (
    <div>
      <div className="font-bold text-lg text-foreground">{number}</div>

      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function FeatureCard({ feature }: any) {
  const Icon = feature.icon;

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
          <Icon size={20} />
        </div>

        <CardTitle>{feature.title}</CardTitle>
      </CardHeader>

      <CardContent className="text-muted-foreground">
        {feature.description}
      </CardContent>
    </Card>
  );
}

function ProductCard({ product, onAddToCart }: any) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      {/* IMAGE — FIXED FULL */}

      <div className="w-full h-55 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="
            w-full h-full
            object-cover
            hover:scale-110
            transition duration-500
          "
        />
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <div className="font-medium text-foreground">{product.name}</div>

          <div className="text-muted-foreground text-sm">Premium eyewear</div>
        </div>

        <div className="flex justify-between items-center">
          <div className="font-bold text-foreground">{product.price}</div>

          <Button size="sm" onClick={onAddToCart}>
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
