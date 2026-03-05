import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Glasses,
  Package,
  ShoppingCart,
  Palette,
  Package2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { LoadingSpinner, EmptyState } from "@/shared/components/common";
import { useProductDetail } from "../hooks/useProducts";
import type { ProductVariant } from "../types";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useProductDetail(id || "");
  const variant = data as ProductVariant | undefined;
  const isActive = String(variant?.status || "").toLowerCase() === "active";

  const handleBackToPrevious = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/products");
  };

  if (isLoading) return <LoadingSpinner className="py-20" size="lg" />;

  if (error || !variant || !isActive) {
    return (
      <div className="py-12">
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description="Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xoá."
        />
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={handleBackToPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang trước
          </Button>
        </div>
      </div>
    );
  }

  const product = variant.product;
  const variantImage = variant.images?.[0];
  const frameSpec = product.specs?.frame_specs?.[0];
  const price = parseFloat(variant.price).toLocaleString("vi-VN");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/products")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="flex items-center justify-center rounded-lg bg-muted p-8">
          {variantImage?.path ? (
            <img
              src={variantImage.path}
              alt={variant.name}
              className="max-h-96 w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
              <Glasses className="h-16 w-16" />
              <p>Không có hình ảnh</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {variant.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mã: {variant.code}
                </p>
              </div>
              <Badge variant="default" className="shrink-0">
                {variant.status}
              </Badge>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-primary">₫{price}</div>

            {/* Brand */}
            {product.brand && (
              <div className="text-sm text-muted-foreground">
                Thương hiệu:{" "}
                <span className="font-semibold text-foreground">
                  {product.brand.name}
                </span>
              </div>
            )}
          </div>

          {/* Variant Info */}
          <div className="space-y-3 border-t pt-4">
            {/* Color */}
            <div className="flex items-center gap-3">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Màu sắc:</span>
              <Badge variant="secondary">{variant.color}</Badge>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <Package2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tồn kho:</span>
              <span
                className={
                  variant.quantity > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {variant.quantity > 0 ? `${variant.quantity} cái` : "Hết hàng"}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground pt-2">
              {variant.description}
            </p>
          </div>

          {/* Product Type & Categories */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Loại:</span>
              <span className="text-sm">{product.product_type}</span>
            </div>

            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap items-start gap-2">
                <span className="text-sm font-medium">Danh mục:</span>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((cat) => (
                    <Badge key={cat.id} variant="secondary">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Base Product Description */}
          <div className="space-y-2 border-t pt-4">
            <p className="text-xs font-semibold text-muted-foreground">
              Mô tả sản phẩm
            </p>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Frame Specs */}
          {frameSpec && (
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold">Thông số kỹ thuật</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Loại:</span>
                  <p className="font-medium">{frameSpec.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Chất liệu:</span>
                  <p className="font-medium">{frameSpec.material}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dáng:</span>
                  <p className="font-medium">{frameSpec.shape}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cân nặng:</span>
                  <p className="font-medium">{frameSpec.weight}g</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">
                    Kích thước A x B x DBL:
                  </span>
                  <p className="font-medium">
                    {frameSpec.a} x {frameSpec.b} x {frameSpec.dbl}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 border-t pt-4">
            <AddToCartButton
              variantId={variant.id}
              size="lg"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
