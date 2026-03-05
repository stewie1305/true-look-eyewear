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
import type { CreateRxLensSpecDto } from "../pages/types";

interface RxLensSpecFormProps {
  defaultValues?: Partial<CreateRxLensSpecDto>;
  onSubmit: (data: CreateRxLensSpecDto) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function RxLensSpecForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Lưu",
}: RxLensSpecFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateRxLensSpecDto>({
    defaultValues: {
      product_id: "",
      type: "",
      material: "",
      lens_width: 0,
      min_sphere: 0,
      max_sphere: 0,
      min_cylinder: 0,
      max_cylinder: 0,
      status: "active",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tròng kính thuốc</CardTitle>
          <CardDescription>Nhập thông số tròng kính thuốc cho sản phẩm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product_id">
              Product ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="product_id"
              {...register("product_id", { required: "Product ID là bắt buộc" })}
              placeholder="Nhập product id"
            />
            {errors.product_id && (
              <p className="text-sm text-destructive">{errors.product_id.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">
                Loại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="type"
                {...register("type", { required: "Loại là bắt buộc" })}
                placeholder="Ví dụ: Single Vision"
              />
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">
                Chất liệu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="material"
                {...register("material", { required: "Chất liệu là bắt buộc" })}
                placeholder="Ví dụ: Polycarbonate"
              />
              {errors.material && (
                <p className="text-sm text-destructive">{errors.material.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="lens_width">
                Độ rộng tròng <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lens_width"
                type="number"
                step="0.1"
                {...register("lens_width", {
                  required: "Độ rộng tròng là bắt buộc",
                  valueAsNumber: true,
                })}
              />
              {errors.lens_width && (
                <p className="text-sm text-destructive">{errors.lens_width.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_sphere">
                Min Sphere <span className="text-destructive">*</span>
              </Label>
              <Input
                id="min_sphere"
                type="number"
                step="0.25"
                {...register("min_sphere", {
                  required: "Min Sphere là bắt buộc",
                  valueAsNumber: true,
                })}
              />
              {errors.min_sphere && (
                <p className="text-sm text-destructive">{errors.min_sphere.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_sphere">
                Max Sphere <span className="text-destructive">*</span>
              </Label>
              <Input
                id="max_sphere"
                type="number"
                step="0.25"
                {...register("max_sphere", {
                  required: "Max Sphere là bắt buộc",
                  valueAsNumber: true,
                })}
              />
              {errors.max_sphere && (
                <p className="text-sm text-destructive">{errors.max_sphere.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="min_cylinder">
                Min Cylinder <span className="text-destructive">*</span>
              </Label>
              <Input
                id="min_cylinder"
                type="number"
                step="0.25"
                {...register("min_cylinder", {
                  required: "Min Cylinder là bắt buộc",
                  valueAsNumber: true,
                })}
              />
              {errors.min_cylinder && (
                <p className="text-sm text-destructive">{errors.min_cylinder.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_cylinder">
                Max Cylinder <span className="text-destructive">*</span>
              </Label>
              <Input
                id="max_cylinder"
                type="number"
                step="0.25"
                {...register("max_cylinder", {
                  required: "Max Cylinder là bắt buộc",
                  valueAsNumber: true,
                })}
              />
              {errors.max_cylinder && (
                <p className="text-sm text-destructive">{errors.max_cylinder.message}</p>
              )}
            </div>
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
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link to="/admin/rx-lens-specs">Huỷ</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
