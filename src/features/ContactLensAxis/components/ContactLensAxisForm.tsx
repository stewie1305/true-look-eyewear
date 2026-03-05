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
import type { CreateContactLensAxisDto } from "../types";

interface ContactLensAxisFormProps {
  defaultValues?: Partial<CreateContactLensAxisDto>;
  onSubmit: (data: CreateContactLensAxisDto) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function ContactLensAxisForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Lưu",
}: ContactLensAxisFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateContactLensAxisDto>({
    defaultValues: {
      contact_lens_spec_id: "",
      axis_value: 0,
      status: "active",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin Contact Lens Axis</CardTitle>
          <CardDescription>
            Nhập thông tin chi tiết contact lens axis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contact Lens Spec ID */}
          <div className="space-y-2">
            <Label htmlFor="contact_lens_spec_id">
              Contact Lens Spec ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact_lens_spec_id"
              {...register("contact_lens_spec_id", {
                required: "Contact Lens Spec ID là bắt buộc",
              })}
              placeholder="Nhập contact lens spec ID"
            />
            {errors.contact_lens_spec_id && (
              <p className="text-sm text-destructive">
                {errors.contact_lens_spec_id.message}
              </p>
            )}
          </div>

          {/* Axis Value */}
          <div className="space-y-2">
            <Label htmlFor="axis_value">
              Axis Value <span className="text-destructive">*</span>
            </Label>
            <Input
              id="axis_value"
              type="number"
              step="0.01"
              {...register("axis_value", {
                required: "Axis value là bắt buộc",
                valueAsNumber: true,
                min: { value: 0, message: "Axis value phải >= 0" },
              })}
              placeholder="Nhập axis value"
            />
            {errors.axis_value && (
              <p className="text-sm text-destructive">
                {errors.axis_value.message}
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
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link to="/admin/contact-lens-axis">Hủy</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
