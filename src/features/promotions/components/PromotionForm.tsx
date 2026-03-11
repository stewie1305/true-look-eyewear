import { useForm } from "react-hook-form";
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
import type { CreatePromotionDto } from "../types";

interface PromotionFormProps {
  defaultValues?: Partial<CreatePromotionDto>;
  onSubmit: (data: CreatePromotionDto) => void;
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
  } = useForm<CreatePromotionDto>({
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
          <CardDescription>Nhập thông tin khuyến mãi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên khuyến mãi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Tên khuyến mãi là bắt buộc" })}
              placeholder="Ví dụ: SALE 10%"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="condition">
                Điều kiện (số tiền) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="condition"
                type="number"
                {...register("condition", {
                  required: "Điều kiện là bắt buộc",
                  valueAsNumber: true,
                  min: { value: 0, message: "Điều kiện phải >= 0" },
                })}
                placeholder="Ví dụ: 1000000"
              />
              {errors.condition && (
                <p className="text-sm text-destructive">
                  {errors.condition.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">
                Giảm giá <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discount"
                type="number"
                {...register("discount", {
                  required: "Giảm giá là bắt buộc",
                  valueAsNumber: true,
                  min: { value: 0, message: "Giảm giá phải >= 0" },
                })}
                placeholder="Ví dụ: 100000"
              />
              {errors.discount && (
                <p className="text-sm text-destructive">
                  {errors.discount.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_time">
                Thời gian bắt đầu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="start_time"
                type="datetime-local"
                {...register("start_time", {
                  required: "Thời gian bắt đầu là bắt buộc",
                })}
              />
              {errors.start_time && (
                <p className="text-sm text-destructive">
                  {errors.start_time.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">
                Thời gian kết thúc <span className="text-destructive">*</span>
              </Label>
              <Input
                id="end_time"
                type="datetime-local"
                {...register("end_time", {
                  required: "Thời gian kết thúc là bắt buộc",
                })}
              />
              {errors.end_time && (
                <p className="text-sm text-destructive">
                  {errors.end_time.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={String(watch("status"))}
              onValueChange={(value) => setValue("status", value)}
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
