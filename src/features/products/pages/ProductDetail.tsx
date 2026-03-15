import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Glasses,
  Package,
  Palette,
  Package2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { LoadingSpinner, EmptyState } from "@/shared/components/common";
import { useProductDetail } from "../hooks/useProducts";
import { useImageBlobUrl } from "@/features/images/hooks/useImages";
import type { ProductVariant, VariantImage } from "../types";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { cn } from "@/lib/utils";

// Component con load blob URL cho từng ảnh riêng lẻ
function ImageBlobImg({
  imageId,
  alt,
  className,
  onClick,
  selected,
}: {
  imageId: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}) {
  const blobUrl = useImageBlobUrl(imageId);
  if (!blobUrl) return null;
  return (
    <img
      src={blobUrl}
      alt={alt}
      className={cn(
        className,
        (selected || onClick) && "cursor-pointer",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
      onClick={onClick}
    />
  );
}

// Gallery: ảnh lớn + thumbnail strip
function ProductImageGallery({
  images,
  name,
}: {
  images: VariantImage[];
  name: string;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedImage = images[selectedIdx];

  return (
    <div className="flex flex-col gap-3">
      {/* Ảnh chính + nút prev/next */}
      <div className="relative flex items-center justify-center rounded-lg bg-muted p-8 min-h-64">
        {selectedImage ? (
          <ImageBlobImg
            imageId={selectedImage.id}
            alt={name}
            className="max-h-96 w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
            <Glasses className="h-16 w-16" />
            <p>Không có hình ảnh</p>
          </div>
        )}

        {/* Prev / Next buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedIdx((i) => (i - 1 + images.length) % images.length)
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow hover:bg-background transition"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedIdx((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow hover:bg-background transition"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === selectedIdx ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/40"}`}
                  aria-label={`Ảnh ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip — chỉ hiện nếu có > 1 ảnh */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={`shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted border-2 transition-colors ${
                idx === selectedIdx ? "border-primary" : "border-transparent"
              }`}
            >
              <ImageBlobImg
                imageId={img.id}
                alt={`${name} ${idx + 1}`}
                className="w-full h-full object-cover"
                onClick={() => setSelectedIdx(idx)}
                selected={idx === selectedIdx}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useProductDetail(id || "");
  const rawData = data as ProductVariant | ProductVariant[] | undefined;
  const variant = Array.isArray(rawData) ? rawData[0] : rawData;
  const isActive = String(variant?.status || "").toLowerCase() === "active";

  const handleBackToPrevious = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/products");
  };

  const variantImages = variant?.images ?? [];

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
        {/* Product Images */}
        <ProductImageGallery images={variantImages} name={variant.name} />

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
                  variant.quantity > 0 ? "text-primary" : "text-destructive"
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
