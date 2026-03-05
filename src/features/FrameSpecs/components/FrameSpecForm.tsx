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
import type { CreateFrameSpecDto } from "../types";

interface FrameSpecFormProps {
  defaultValues?: Partial<CreateFrameSpecDto>;
  onSubmit: (data: CreateFrameSpecDto) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function FrameSpecForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Luu",
}: FrameSpecFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateFrameSpecDto>({
    defaultValues: {
      product_id: "",
      type: "",
      material: "",
      a: 0,
      b: 0,
      dbl: 0,
      shape: "",
      weight: 0,
      status: "active",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thong tin frame spec</CardTitle>
          <CardDescription>Nhap thong so khung kinh cho san pham</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product_id">
              Product ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="product_id"
              {...register("product_id", { required: "Product ID la bat buoc" })}
              placeholder="Nhap product id"
            />
            {errors.product_id && (
              <p className="text-sm text-destructive">{errors.product_id.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">
                Type <span className="text-destructive">*</span>
              </Label>
              <Input
                id="type"
                {...register("type", { required: "Type la bat buoc" })}
                placeholder="Vi du: Full Rim"
              />
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">
                Material <span className="text-destructive">*</span>
              </Label>
              <Input
                id="material"
                {...register("material", { required: "Material la bat buoc" })}
                placeholder="Vi du: Titanium"
              />
              {errors.material && (
                <p className="text-sm text-destructive">{errors.material.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="a">
                A <span className="text-destructive">*</span>
              </Label>
              <Input
                id="a"
                type="number"
                step="0.1"
                {...register("a", {
                  required: "A la bat buoc",
                  valueAsNumber: true,
                  min: { value: 0, message: "A phai >= 0" },
                })}
              />
              {errors.a && <p className="text-sm text-destructive">{errors.a.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="b">
                B <span className="text-destructive">*</span>
              </Label>
              <Input
                id="b"
                type="number"
                step="0.1"
                {...register("b", {
                  required: "B la bat buoc",
                  valueAsNumber: true,
                  min: { value: 0, message: "B phai >= 0" },
                })}
              />
              {errors.b && <p className="text-sm text-destructive">{errors.b.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dbl">
                DBL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dbl"
                type="number"
                step="0.1"
                {...register("dbl", {
                  required: "DBL la bat buoc",
                  valueAsNumber: true,
                  min: { value: 0, message: "DBL phai >= 0" },
                })}
              />
              {errors.dbl && (
                <p className="text-sm text-destructive">{errors.dbl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">
                Weight <span className="text-destructive">*</span>
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                {...register("weight", {
                  required: "Weight la bat buoc",
                  valueAsNumber: true,
                  min: { value: 0, message: "Weight phai >= 0" },
                })}
              />
              {errors.weight && (
                <p className="text-sm text-destructive">{errors.weight.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shape">
                Shape <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shape"
                {...register("shape", { required: "Shape la bat buoc" })}
                placeholder="Vi du: Rectangle"
              />
              {errors.shape && (
                <p className="text-sm text-destructive">{errors.shape.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trang thai</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoat dong</SelectItem>
                  <SelectItem value="inactive">Khong hoat dong</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link to="/admin/frame-specs">Huy</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
