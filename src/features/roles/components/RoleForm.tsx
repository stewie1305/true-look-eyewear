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
import type { CreateRoleDto } from "../types";

interface RoleFormProps {
  defaultValues?: Partial<CreateRoleDto>;
  onSubmit: (data: CreateRoleDto) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function RoleForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Lưu",
}: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleDto>({
    defaultValues: {
      name: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin quyền</CardTitle>
          <CardDescription>Nhập tên quyền mới</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên quyền <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Tên quyền là bắt buộc" })}
              placeholder="Ví dụ: SystemAdmin"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link to="/admin/roles">Hủy</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
