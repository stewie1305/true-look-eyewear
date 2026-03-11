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

type ProfileFormState = {
  status: 0 | 1;
  username: string;
  password: string;
  fullName: string;
  gender: string;
  email: string;
  birthday: string;
};

const EMPTY_PROFILE_FORM: ProfileFormState = {
  status: 1,
  username: "",
  password: "",
  fullName: "",
  gender: "M",
  email: "",
  birthday: "",
};

export default function EditUserProfilePage() {
  const navigate = useNavigate();
  const [profileForm, setProfileForm] =
    useState<ProfileFormState>(EMPTY_PROFILE_FORM);
  const [profileError, setProfileError] = useState("");

  const { data: user, isLoading, error: fetchError } = useUserMe();
  const updateUserMeMutation = useUpdateUserMe();

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      status: normalizeStatusValue(user.status),
      username: user.username || "",
      password: "",
      fullName: user.fullName || "",
      gender: normalizeGenderValue(user.gender),
      email: user.email || "",
      birthday: toDateInputValue(user.birthday),
    });
  }, [user]);

  const resetProfileForm = () => {
    if (!user) {
      setProfileForm(EMPTY_PROFILE_FORM);
      return;
    }

    setProfileForm({
      status: normalizeStatusValue(user.status),
      username: user.username || "",
      password: "",
      fullName: user.fullName || "",
      gender: normalizeGenderValue(user.gender),
      email: user.email || "",
      birthday: toDateInputValue(user.birthday),
    });
    setProfileError("");
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");

    if (!profileForm.username.trim())
      return setProfileError("Vui lòng nhập tên đăng nhập");
    if (!profileForm.fullName.trim())
      return setProfileError("Vui lòng nhập họ tên");
    if (!profileForm.email.trim())
      return setProfileError("Vui lòng nhập email");
    if (!profileForm.birthday)
      return setProfileError("Vui lòng chọn ngày sinh");
    if (profileForm.password && profileForm.password.length < 6)
      return setProfileError("Mật khẩu tối thiểu 6 ký tự");

    const payload: UpdateUserDto = {
      status: profileForm.status,
      username: profileForm.username.trim(),
      fullName: profileForm.fullName.trim(),
      gender: profileForm.gender,
      email: profileForm.email.trim(),
      birthday: profileForm.birthday,
    };

    if (profileForm.password.trim()) {
      payload.password = profileForm.password;
    }

    updateUserMeMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/profile", {
          replace: true,
          state: {
            profileUpdated: true,
            successMessage:
              "Lưu thay đổi hồ sơ thành công. Thông tin cá nhân của bạn đã được cập nhật.",
          },
        });
      },
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chỉnh sửa hồ sơ</h1>
          <p className="text-sm text-muted-foreground">
            Cập nhật thông tin cá nhân của tài khoản đăng nhập.
          </p>
        </div>

        <Button type="button" variant="outline" asChild>
          <Link to="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại profile
          </Link>
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Thông tin chỉnh sửa</CardTitle>
          <CardDescription>Điền các trường bạn muốn cập nhật</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-username">Tên đăng nhập</Label>
              <Input
                id="profile-username"
                value={profileForm.username}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-full-name">Họ tên</Label>
              <Input
                id="profile-full-name"
                value={profileForm.fullName}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                placeholder="Nhập họ tên"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="user@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-birthday">Ngày sinh</Label>
                <Input
                  id="profile-birthday"
                  type="date"
                  value={profileForm.birthday}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      birthday: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Giới tính</Label>
                <Select
                  value={profileForm.gender}
                  onValueChange={(value) =>
                    setProfileForm((prev) => ({ ...prev, gender: value }))
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
                  value={String(profileForm.status)}
                  onValueChange={(value) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      status: Number(value) as 0 | 1,
                    }))
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
              <Label htmlFor="profile-password">
                Mật khẩu mới (không bắt buộc)
              </Label>
              <Input
                id="profile-password"
                type="password"
                value={profileForm.password}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Nhập mật khẩu nếu muốn đổi"
              />
            </div>

            {profileError && (
              <p className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                {profileError}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetProfileForm}
                disabled={updateUserMeMutation.isPending}
              >
                Khôi phục
              </Button>
              <Button type="submit" disabled={updateUserMeMutation.isPending}>
                {updateUserMeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
