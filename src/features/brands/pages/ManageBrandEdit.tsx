import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { BrandForm } from "../components/BrandForm";
import { useBrandDetail, useUpdateBrand } from "../hooks/useBrands";
import type { UpdateBrandDto } from "../types";

/**
 * Trang chỉnh sửa thương hiệu (Admin).
 */
export default function ManageBrandEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: brand, isLoading } = useBrandDetail(id!);
  const { mutate: updateBrand, isPending } = useUpdateBrand();

  const handleSubmit = (data: UpdateBrandDto) => {
    updateBrand({ id: id!, data });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy thương hiệu</p>
        <Button asChild>
          <Link to="/admin/brands">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/brands">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Chỉnh sửa thương hiệu</h2>

      <BrandForm
        defaultValues={{
          name: brand.name,
          status: brand.status,
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
