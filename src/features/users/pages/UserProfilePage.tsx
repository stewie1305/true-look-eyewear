import { useState } from "react";
import {
  Calendar,
  Loader2,
  Lock,
  Mail,
  MapPinPlus,
  PencilLine,
  RefreshCw,
  User,
  Users2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useChangePasswordMutation } from "@/features/auth/hooks/useAuthMutation";
import { useUserMe } from "@/features/users/hooks/useUsers";
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

const formatDate = (date?: string) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("vi-VN");
};

const mapGender = (gender?: string) => {
  if (!gender) return "-";
  const normalized = gender.toLowerCase();
  if (normalized === "m" || normalized === "male") return "Nam";
  if (normalized === "f" || normalized === "female") return "Nữ";
  return gender;
};

export default function UserProfilePage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const {
    data: user,
    isLoading,
    isFetching,
    error: fetchError,
    refetch,
  } = useUserMe();
  const changePasswordMutation = useChangePasswordMutation();

  const resetPasswordForm = () => {
    setShowChangePassword(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!oldPassword) return setError("Vui lòng nhập mật khẩu cũ");
    if (!newPassword) return setError("Vui lòng nhập mật khẩu mới");
    if (newPassword.length < 8)
      return setError("Mật khẩu mới phải có ít nhất 8 ký tự");
    if (newPassword !== confirmPassword)
      return setError("Mật khẩu xác nhận không khớp");
    if (oldPassword === newPassword)
      return setError("Mật khẩu mới phải khác mật khẩu cũ");

    changePasswordMutation.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: resetPasswordForm,
      },
    );
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
      <div>
        <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-sm text-muted-foreground">
          Xem thông tin tài khoản và quản lý bảo mật.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => refetch()}>
            {isFetching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>

          <Button asChild>
            <Link to="/profile/edit">
              <PencilLine className="mr-2 h-4 w-4" />
              Chỉnh sửa profile
            </Link>
          </Button>

          <Button asChild>
            <Link to="/addresses">
              <MapPinPlus className="mr-2 h-4 w-4" />
              Thêm address
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
          <CardDescription>Dữ liệu được lấy từ hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-start gap-3">
            <User className="mt-1 h-5 w-5 text-primary" />
            <div>
              <Label>Họ tên</Label>
              <p className="font-medium">{user.fullName || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-primary" />
            <div>
              <Label>Email</Label>
              <p className="font-medium">{user.email || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-primary" />
              <div>
                <Label>Ngày sinh</Label>
                <p className="font-medium">{formatDate(user.birthday)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users2 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <Label>Giới tính</Label>
                <p className="font-medium">{mapGender(user.gender)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Bảo mật</CardTitle>
          <CardDescription>Đổi mật khẩu tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setShowChangePassword(true)}
            className="w-full"
          >
            <Lock className="mr-2 h-4 w-4" />
            Đổi mật khẩu
          </Button>
        </CardContent>
      </Card>

      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>
                Nhập mật khẩu cũ và mật khẩu mới của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="old-password">Mật khẩu cũ</Label>
                  <Input
                    id="old-password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Mật khẩu mới</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    Xác nhận mật khẩu mới
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetPasswordForm}
                    disabled={changePasswordMutation.isPending}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý
                      </>
                    ) : (
                      "Xác nhận"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
