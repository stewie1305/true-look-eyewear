import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ProductForm } from "../components/ProductForm";
import { useCreateProduct } from "../hooks/useProducts";
import type { CreateProductDto } from "../types";

const FIXED_PRODUCT_ID = "1";

export function ManageProductCreate() {
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = (data: CreateProductDto) => {
    createProduct({
      ...data,
      product_id: FIXED_PRODUCT_ID,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/products">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Tạo sản phẩm mới</h2>

      <ProductForm
        defaultValues={{ product_id: FIXED_PRODUCT_ID }}
        lockProductId
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo sản phẩm"
      />
    </div>
  );
}

export default ManageProductCreate;
