import { Link } from "react-router-dom";
import { useImageBlobUrl } from "@/features/images/hooks/useImages";
import type { Product } from "../types";
import { ImageOff } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productImage = product.images?.[0];
  const imageSrc = useImageBlobUrl(productImage?.id);

  // In case the backend returns price directly on the product object
  const anyProduct = product as any;
  const price = anyProduct.price || anyProduct.min_price || null;

  return (
    <Link to={`/products/${product.id}`} className="group flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-secondary/40 dark:bg-secondary/20 flex items-center justify-center transition-all duration-300 border border-border/40 hover:shadow-md">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <ImageOff className="h-10 w-10 text-muted-foreground/40" />
        )}
      </div>

      {/* Product Details */}
      <div className="mt-4 flex flex-col space-y-1.5 px-1">
        <h3 className="text-sm text-foreground/90 font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground font-normal">
          Mã hàng: {product.code}
        </p>
        <p className="text-[15px] font-semibold text-foreground pt-1">
          {price
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(price))
            : "Giá liên hệ"}
        </p>
      </div>
    </Link>
  );
}
