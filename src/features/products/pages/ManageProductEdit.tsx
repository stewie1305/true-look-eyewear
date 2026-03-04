import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ProductForm } from "../components/ProductForm";
import { useProductDetail, useUpdateProduct } from "../hooks/useProducts";
import type { UpdateProductDto } from "../types";

/**
 * Trang chỉnh sửa sản phẩm (Admin).
 */
export default function ManageProductEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProductDetail(id!);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const handleSubmit = (data: UpdateProductDto) => {
    updateProduct({ id: id!, data });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
        <Button asChild>
          <Link to="/admin/products">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/products">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Chỉnh sửa sản phẩm</h2>

      <ProductForm
        defaultValues={{
          product_id: product.product_id,
          code: product.code,
          name: product.name,
          price: Number(product.price ?? 0),
          color: product.color,
          quantity: product.quantity,
          description: product.description,
          status: product.status,
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
