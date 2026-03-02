import { useQuery } from "@tanstack/react-query";
import { authService } from "../services";
import { useChangePasswordMutation } from "../hooks/useAuthMutation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Loader2, Lock, Mail, User, Calendar, Users2 } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const changePasswordMutation = useChangePasswordMutation();

  // Fetch user info
  const {
    data: user,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => authService.getMe(),
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!oldPassword) {
      setError("Vui lòng nhập mật khẩu cũ");
      return;
    }

    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (oldPassword === newPassword) {
      setError("Mật khẩu mới phải khác mật khẩu cũ");
      return;
    }

    changePasswordMutation.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setShowChangePassword(false);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setError("");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (fetchError || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Lỗi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">
              {fetchError instanceof Error
                ? fetchError.message
                : "Không thể tải thông tin người dùng"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const genderLabel = user.gender === "M" ? "Nam" : "Nữ";

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and security
          </p>
        </div>

        {/* Profile Info Card */}
        <Card className="shadow-xl border-border/50">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Basic information about your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Username */}
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </Label>
                <p className="text-lg font-semibold mt-1">
                  {user.fullName || "N/A"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent">
                <Mail className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <p className="text-lg font-semibold mt-1">{user.email}</p>
              </div>
            </div>

            {/* Birthday */}
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-secondary">
                <Calendar className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-muted-foreground">
                  Birthday
                </Label>
                <p className="text-lg font-semibold mt-1">
                  {user.birthday
                    ? new Date(user.birthday).toLocaleDateString("en-US")
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-muted">
                <Users2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-muted-foreground">
                  Gender
                </Label>
                <p className="text-lg font-semibold mt-1">{genderLabel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="shadow-xl border-border/50">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and account security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowChangePassword(true)}
              className="w-full"
            >
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Change Password Dialog */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <Card className="w-full max-w-md shadow-2xl border-border">
              <CardHeader className="text-center">
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Enter your old password and new password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="old-password">Old Password</Label>
                    <Input
                      id="old-password"
                      type="password"
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowChangePassword(false);
                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setError("");
                      }}
                      disabled={changePasswordMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
