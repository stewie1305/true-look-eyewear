import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { Product } from "../types";
import { getImageUrl } from "@/lib/env";
import { Tag, ImageOff } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const firstCategory = product.categories?.[0];
  const frameSpec = product.specs?.frame_specs?.[0];
  const productImage = product.images?.[0];

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {productImage?.path ? (
          <img
            src={getImageUrl(productImage.path)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <ImageOff className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        {product.status === "Active" && (
          <Badge className="absolute right-2 top-2" variant="default">
            Mới
          </Badge>
        )}
      </div>

      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
          {product.brand && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              {product.brand.name}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          {product.description || "Không có mô tả"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Product Type & Code */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span className="font-medium">{product.code}</span>
          <span>•</span>
          <span>{product.product_type}</span>
        </div>

        {/* Frame Specs */}
        {frameSpec && (
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-xs font-normal">
              {frameSpec.material}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              {frameSpec.shape}
            </Badge>
            {frameSpec.weight && (
              <Badge variant="outline" className="text-xs font-normal">
                {frameSpec.weight}g
              </Badge>
            )}
          </div>
        )}

        {/* Category */}
        {firstCategory && (
          <div className="text-xs text-muted-foreground">
            {firstCategory.name}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link to={`/products/${product.id}`}>Xem chi tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
