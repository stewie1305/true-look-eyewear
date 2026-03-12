import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  promotionSchema,
  type PromotionFormData,
  type PromotionFormInput,
} from "../schema";

interface PromotionFormProps {
  defaultValues?: Partial<PromotionFormInput>;
  onSubmit: (data: PromotionFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function PromotionForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Lưu",
}: PromotionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PromotionFormInput, unknown, PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: "",
      condition: 0,
      discount: 0,
      start_time: "",
      end_time: "",
      status: "active",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin khuyến mãi</CardTitle>
          <CardDescription>
            Nhập thông tin chi tiết của chương trình khuyến mãi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên khuyến mãi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nhập tên chương trình khuyến mãi"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Condition & Discount in a grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="condition">
                Điều kiện đơn tối thiểu (VNĐ){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="condition"
                type="number"
                min={0}
                {...register("condition", { valueAsNumber: true })}
                placeholder="Ví dụ: 500000"
              />
              {errors.condition && (
                <p className="text-sm text-destructive">
                  {errors.condition.message}
                </p>
              )}
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <Label htmlFor="discount">
                Giá trị giảm giá (VNĐ){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discount"
                type="number"
                min={0}
                {...register("discount", { valueAsNumber: true })}
                placeholder="Ví dụ: 100000"
              />
              {errors.discount && (
                <p className="text-sm text-destructive">
                  {errors.discount.message}
                </p>
              )}
            </div>
          </div>

          {/* Start & End time in a grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Start time */}
            <div className="space-y-2">
              <Label htmlFor="start_time">
                Ngày bắt đầu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="start_time"
                type="datetime-local"
                {...register("start_time")}
              />
              {errors.start_time && (
                <p className="text-sm text-destructive">
                  {errors.start_time.message}
                </p>
              )}
            </div>

            {/* End time */}
            <div className="space-y-2">
              <Label htmlFor="end_time">
                Ngày kết thúc <span className="text-destructive">*</span>
              </Label>
              <Input
                id="end_time"
                type="datetime-local"
                {...register("end_time")}
              />
              {errors.end_time && (
                <p className="text-sm text-destructive">
                  {errors.end_time.message}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={watch("status") ?? "active"}
              onValueChange={(value) =>
                setValue("status", value as "active" | "inactive")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link to="/admin/promotions">Hủy</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
