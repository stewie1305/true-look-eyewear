import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { PromotionForm } from "../components/PromotionForm";
import { usePromotionDetail, useUpdatePromotion } from "../hooks/usePromotions";
import type { PromotionFormInput, PromotionFormData } from "../schema";

const toDatetimeLocal = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (num: number) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

export default function ManagePromotionEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: promotion, isLoading } = usePromotionDetail(id!);
  const { mutate: updatePromotion, isPending } = useUpdatePromotion();

  const handleSubmit = (data: PromotionFormData) => {
    updatePromotion({ id: id!, data });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy khuyến mãi</p>
        <Button asChild>
          <Link to="/admin/promotions">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const defaultValues: Partial<PromotionFormInput> = {
    name: promotion.name,
    condition: Number(promotion.condition) || 0,
    discount: Number(promotion.discount) || 0,
    start_time: toDatetimeLocal(promotion.start_time),
    end_time: toDatetimeLocal(promotion.end_time),
    status: (promotion.status?.toLowerCase() === "inactive"
      ? "inactive"
      : "active") as "active" | "inactive",
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/promotions">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Chỉnh sửa khuyến mãi</h2>

      <PromotionForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
