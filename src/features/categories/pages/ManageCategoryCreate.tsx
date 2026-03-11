import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { CategoryForm } from "../components/CategoryForm";
import { useCreateCategory } from "../hooks/useCategories";
import type { CreateCategoryDto } from "../types";


export function ManageCategoryCreate() {
  const { mutate: createCategory, isPending } = useCreateCategory();

  const handleSubmit = (data: CreateCategoryDto) => {
    createCategory(data);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/categories">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Tạo danh mục mới</h2>

      <CategoryForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo danh mục"
      />
    </div>
  );
}

export default ManageCategoryCreate;
