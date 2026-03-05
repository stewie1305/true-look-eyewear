import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { CategoryForm } from "../components/CategoryForm";
import { useCategoryDetail, useUpdateCategory } from "../hooks/useCategories";
import type { UpdateCategoryDto } from "../types";

/**
 * Trang chỉnh sửa danh mục (Admin).
 */
export default function ManageCategoryEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading } = useCategoryDetail(id!);
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const handleSubmit = (data: UpdateCategoryDto) => {
    updateCategory({ id: id!, data });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy danh mục</p>
        <Button asChild>
          <Link to="/admin/categories">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/categories">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Chỉnh sửa danh mục</h2>

      <CategoryForm
        defaultValues={{
          name: category.name,
          status: category.status,
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
