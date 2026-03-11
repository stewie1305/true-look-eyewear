import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useUpdateUserMe, useUserMe } from "@/features/users/hooks/useUsers";
import type { UpdateUserDto } from "@/features/users/types";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type ProfileFormState = {
  status: 0 | 1;
  username: string;
  password: string;
  fullName: string;
  gender: string;
  email: string;
  birthday: string;
};

const normalizeGenderValue = (gender?: string) => {
  const normalized = String(gender || "").toLowerCase();
  if (normalized === "f" || normalized === "female") return "F";
  return "M";
};

const normalizeStatusValue = (status?: string | number) => {
  if (status === 0 || String(status).toLowerCase() === "inactive") return 0;
  return 1;
};

const toDateInputValue = (date?: string) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function EditUserProfilePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProfileFormState>({
    status: 1,
    username: "",
    password: "",
    fullName: "",
    gender: "M",
    email: "",
    birthday: "",
  });

  const { data: user, isLoading, error: fetchError } = useUserMe();
  const updateMutation = useUpdateUserMe();

  useEffect(() => {
    if (!user) return;
    setForm({
      status: normalizeStatusValue(user.status),
      username: user.username || "",
      password: "",
      fullName: user.fullName || "",
      gender: normalizeGenderValue(user.gender),
      email: user.email || "",
      birthday: toDateInputValue(user.birthday),
    });
  }, [user]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim()) return setError("Vui lòng nhập tên đăng nhập");
    if (!form.fullName.trim()) return setError("Vui lòng nhập họ tên");
    if (!form.email.trim()) return setError("Vui lòng nhập email");
    if (!form.birthday) return setError("Vui lòng chọn ngày sinh");
    if (form.password && form.password.length < 6)
      return setError("Mật khẩu tối thiểu 6 ký tự");

    const payload: UpdateUserDto = {
      status: form.status,
      username: form.username.trim(),
      fullName: form.fullName.trim(),
      gender: form.gender,
      email: form.email.trim(),
      birthday: form.birthday,
    };

    if (form.password.trim()) payload.password = form.password.trim();

    updateMutation.mutate(payload, {
      onSuccess: () => navigate("/profile"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (fetchError || !user) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Không tải được hồ sơ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">
              {fetchError instanceof Error
                ? fetchError.message
                : "Vui lòng thử lại sau."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold">Chỉnh sửa profile</h1>
          <p className="text-sm text-muted-foreground">
            Cập nhật thông tin cá nhân
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Về profile
          </Link>
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Thông tin hồ sơ</CardTitle>
          <CardDescription>
            Sửa và lưu thông tin tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, username: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ tên</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fullName: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Ngày sinh</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={form.birthday}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, birthday: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Giới tính</Label>
                <Select
                  value={form.gender}
                  onValueChange={(value) =>
                    setForm((p) => ({ ...p, gender: value }))
                  }
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
                <Label>Trạng thái</Label>
                <Select
                  value={String(form.status)}
                  onValueChange={(value) =>
                    setForm((p) => ({ ...p, status: Number(value) as 0 | 1 }))
                  }
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới (không bắt buộc)</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Lưu thay đổi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
