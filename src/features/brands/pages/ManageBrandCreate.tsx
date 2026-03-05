import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { BrandForm } from "../components/BrandForm";
import { useCreateBrand } from "../hooks/useBrands";
import type { CreateBrandDto } from "../types";

/**
 * Trang tạo thương hiệu mới (Admin).
 */
export function ManageBrandCreate() {
  const { mutate: createBrand, isPending } = useCreateBrand();

  const handleSubmit = (data: CreateBrandDto) => {
    createBrand(data);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/brands">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Tạo thương hiệu mới</h2>

      <BrandForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo thương hiệu"
      />
    </div>
  );
}

export default ManageBrandCreate;
