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
import type { CreateProductDto } from "../types";

interface ProductFormProps {
  defaultValues?: Partial<CreateProductDto>;
  onSubmit: (data: CreateProductDto) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Lưu",
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateProductDto>({
    defaultValues: {
      product_id: "",
      code: "",
      name: "",
      price: 0,
      color: "",
      quantity: 0,
      description: "",
      status: "active",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Nhập thông tin cơ bản của sản phẩm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Mã sản phẩm <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              {...register("code", { required: "Mã sản phẩm là bắt buộc" })}
              placeholder="Nhập mã sản phẩm"
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên sản phẩm <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
              placeholder="Nhập tên sản phẩm"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

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
              placeholder="Nhập product id"
            />
            {errors.product_id && (
              <p className="text-sm text-destructive">
                {errors.product_id.message}
              </p>
            )}
          </div>

          {/* Price, Color, Quantity */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">
                Giá <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                {...register("price", {
                  required: "Giá là bắt buộc",
                  valueAsNumber: true,
                })}
                placeholder="Nhập giá"
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">
                Màu sắc <span className="text-destructive">*</span>
              </Label>
              <Input
                id="color"
                {...register("color", {
                  required: "Màu sắc là bắt buộc",
                })}
                placeholder="Nhập màu sắc"
              />
              {errors.color && (
                <p className="text-sm text-destructive">
                  {errors.color.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              Số lượng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quantity"
              type="number"
              {...register("quantity", {
                required: "Số lượng là bắt buộc",
                valueAsNumber: true,
                min: { value: 0, message: "Số lượng phải >= 0" },
              })}
              placeholder="Nhập số lượng"
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">
                {errors.quantity.message}
              </p>
            )}
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Mô tả <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="description"
              {...register("description", {
                required: "Mô tả là bắt buộc",
              })}
              placeholder="Nhập mô tả sản phẩm"
              className="flex min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link to="/admin/products">Hủy</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
