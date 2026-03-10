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
import type { CreateUserDto, UpdateUserDto, UserRole } from "../types";

interface UserFormProps {
  defaultValues?: Partial<CreateUserDto>;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => void;
  isPending?: boolean;
  submitLabel?: string;
  isEdit?: boolean;
  roles?: UserRole[];
}

const DEFAULT_STATUS = 1;

export function UserForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Lưu",
  isEdit = false,
  roles = [],
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateUserDto>({
    defaultValues: {
      status: DEFAULT_STATUS,
      roleName: "",
      username: "",
      password: "",
      fullName: "",
      gender: "M",
      email: "",
      birthday: "",
      ...defaultValues,
    },
  });

  const submitHandler = handleSubmit((data) => {
    if (isEdit) {
      const { password, ...rest } = data;
      onSubmit(rest as UpdateUserDto);
      return;
    }
    onSubmit(data);
  });

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin người dùng</CardTitle>
          <CardDescription>Nhập thông tin tài khoản</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">
              Tên đăng nhập <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              {...register("username", {
                required: "Tên đăng nhập là bắt buộc",
              })}
              placeholder="Nhập tên đăng nhập"
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">
                Mật khẩu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Mật khẩu là bắt buộc",
                })}
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">
              Họ tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              {...register("fullName", {
                required: "Họ tên là bắt buộc",
              })}
              placeholder="Nhập họ tên"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email là bắt buộc" })}
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">
                Ngày sinh <span className="text-destructive">*</span>
              </Label>
              <Input
                id="birthday"
                type="date"
                {...register("birthday", {
                  required: "Ngày sinh là bắt buộc",
                })}
              />
              {errors.birthday && (
                <p className="text-sm text-destructive">
                  {errors.birthday.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                value={watch("gender")}
                onValueChange={(value) => setValue("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Nam</SelectItem>
                  <SelectItem value="F">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleName">
                Vai trò <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("roleName")}
                onValueChange={(value) => setValue("roleName", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles.length === 0 && (
                    <SelectItem value="__empty" disabled>
                      Không có vai trò
                    </SelectItem>
                  )}
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleName && (
                <p className="text-sm text-destructive">
                  {errors.roleName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={String(watch("status"))}
              onValueChange={(value) => setValue("status", Number(value) as 0 | 1)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Hoạt động</SelectItem>
                <SelectItem value="0">Khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link to="/admin/users">Hủy</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
