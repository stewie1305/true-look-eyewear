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
    <Link 
      to={`/products/${product.id}`} 
      className="group flex flex-col"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#fafafa] dark:bg-white/10 flex items-center justify-center transition-opacity hover:opacity-90">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-[80%] w-[80%] object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImageOff className="h-10 w-10 text-muted-foreground/60 dark:text-muted-foreground/40" />
        )}
        
        {/* Optional Badge for New products */}
        {product.status === "Active" && (
          <span className="absolute right-2 top-2 bg-primary/10 text-primary text-[10px] px-2 py-0.5 font-medium rounded-sm">
            Mới
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-4 flex flex-col space-y-1">
        <h3 className="text-[13px] text-foreground font-medium leading-relaxed line-clamp-2">
          {product.name}, mã hàng: {product.code}
        </h3>
        <p className="text-[13px] font-semibold text-foreground">
          {price 
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price))
            : "Giá liên hệ"
          }
        </p>
      </div>
    </Link>
  );
}
