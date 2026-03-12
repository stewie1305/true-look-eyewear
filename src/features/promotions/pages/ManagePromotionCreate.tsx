import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { PromotionForm } from "../components/PromotionForm";
import { useCreatePromotion } from "../hooks/usePromotions";
import type { PromotionFormData } from "../schema";

export default function ManagePromotionCreate() {
  const { mutate: createPromotion, isPending } = useCreatePromotion();

  const handleSubmit = (data: PromotionFormData) => {
    createPromotion(data);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/promotions">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Tạo khuyến mãi mới</h2>

      <PromotionForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo khuyến mãi"
      />
    </div>
  );
}
