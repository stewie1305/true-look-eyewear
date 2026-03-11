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
import type { CreateContactLensSpecDto } from "../types";
import { useQuery } from "@tanstack/react-query";
import { contactLensAxisService } from "@/features/contactLensAxis/services";
import { QUERY_KEYS } from "@/shared/constants";

interface ContactLensSpecFormProps {
  defaultValues?: Partial<CreateContactLensSpecDto>;
  onSubmit: (data: CreateContactLensSpecDto) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function ContactLensSpecForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Lưu",
}: ContactLensSpecFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateContactLensSpecDto>({
    defaultValues: {
      product_id: "",
      base_curve: 0,
      diameter: 0,
      min_sphere: 0,
      max_sphere: 0,
      min_cylinder: 0,
      max_cylinder: 0,
      axis_min: 0,
      status: "active",
      ...defaultValues,
    },
  });
  const { data: axisData, isLoading: isLoadingAxis } = useQuery({
    queryKey: [
      ...QUERY_KEYS.CONTACT_LENS_AXIS,
      { limit: 1000, status: "active" },
    ],
    queryFn: async () => {
      const response = await contactLensAxisService.getAll({
        limit: 1000,
        status: "active",
      });
      return response;
    },
  });

  const contactLensAxis = Array.isArray(axisData)
    ? axisData
    : (axisData?.data ?? []);
  // Tạo danh sách unique axis_value để hiển thị trong dropdown
  const availableAxisValues = Array.from(
    new Set(contactLensAxis.map((item) => item.axis_value)),
  ).sort((a, b) => a - b);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin Contact Lens Spec</CardTitle>
          <CardDescription>
            Nhập thông số kỹ thuật của kính áp tròng. Axis Min được chọn từ danh
            sách có sẵn.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product ID */}
          <div className="space-y-2">
            <Label htmlFor="product_id">
              Product ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="product_id"
              {...register("product_id", {
                required: "Product ID là bắt buộc",
              })}
              placeholder="Nhập product ID"
            />
            {errors.product_id && (
              <p className="text-sm text-destructive">
                {errors.product_id.message}
              </p>
            )}
          </div>

          {/* Base Curve và Diameter */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base_curve">
                Base Curve (BC) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="base_curve"
                type="number"
                step="0.1"
                {...register("base_curve", {
                  required: "Base curve là bắt buộc",
                  valueAsNumber: true,
                  min: { value: 0, message: "Base curve phải >= 0" },
                })}
                placeholder="Ví dụ: 8.6"
              />
              {errors.base_curve && (
                <p className="text-sm text-destructive">
                  {errors.base_curve.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diameter">
                Diameter (DIA) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="diameter"
                type="number"
                step="0.1"
                {...register("diameter", {
                  required: "Diameter là bắt buộc",
                  valueAsNumber: true,
                  min: { value: 0, message: "Diameter phải >= 0" },
                })}
                placeholder="Ví dụ: 14.2"
              />
              {errors.diameter && (
                <p className="text-sm text-destructive">
                  {errors.diameter.message}
                </p>
              )}
            </div>
          </div>

          {/* Min Sphere và Max Sphere */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_sphere">
                Min Sphere (SPH) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="min_sphere"
                type="number"
                step="0.25"
                {...register("min_sphere", {
                  required: "Min sphere là bắt buộc",
                  valueAsNumber: true,
                })}
                placeholder="Ví dụ: -10.00"
              />
              {errors.min_sphere && (
                <p className="text-sm text-destructive">
                  {errors.min_sphere.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_sphere">
                Max Sphere (SPH) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="max_sphere"
                type="number"
                step="0.25"
                {...register("max_sphere", {
                  required: "Max sphere là bắt buộc",
                  valueAsNumber: true,
                })}
                placeholder="Ví dụ: +6.00"
              />
              {errors.max_sphere && (
                <p className="text-sm text-destructive">
                  {errors.max_sphere.message}
                </p>
              )}
            </div>
          </div>

          {/* Min Cylinder và Max Cylinder */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_cylinder">
                Min Cylinder (CYL) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="min_cylinder"
                type="number"
                step="0.25"
                {...register("min_cylinder", {
                  required: "Min cylinder là bắt buộc",
                  valueAsNumber: true,
                })}
                placeholder="Ví dụ: -2.75"
              />
              {errors.min_cylinder && (
                <p className="text-sm text-destructive">
                  {errors.min_cylinder.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_cylinder">
                Max Cylinder (CYL) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="max_cylinder"
                type="number"
                step="0.25"
                {...register("max_cylinder", {
                  required: "Max cylinder là bắt buộc",
                  valueAsNumber: true,
                })}
                placeholder="Ví dụ: 0"
              />
              {errors.max_cylinder && (
                <p className="text-sm text-destructive">
                  {errors.max_cylinder.message}
                </p>
              )}
            </div>
          </div>

          {/* Axis Min - Dropdown từ ContactLensAxis */}
          <div className="space-y-2">
            <Label htmlFor="axis_min">
              Axis Min <span className="text-destructive">*</span>
            </Label>
            <Select
              value={String(watch("axis_min"))}
              onValueChange={(value) => setValue("axis_min", Number(value))}
              disabled={isLoadingAxis || availableAxisValues.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingAxis
                      ? "Đang tải..."
                      : availableAxisValues.length === 0
                        ? "Không có axis nào"
                        : "Chọn axis min"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableAxisValues.map((axisValue) => (
                  <SelectItem key={axisValue} value={String(axisValue)}>
                    {axisValue}°
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.axis_min && (
              <p className="text-sm text-destructive">
                {errors.axis_min.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Axis Min được lấy từ danh sách Contact Lens Axis có sẵn
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={watch("status")}
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

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link to="/admin/contact-lens-specs">Hủy</Link>
        </Button>
        <Button type="submit" disabled={isPending || isLoadingAxis}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
