import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { UserForm } from "../components/UserForm";
import { useUserDetail, useUpdateUser, useRoles } from "../hooks/useUsers";
import type { UpdateUserDto } from "../types";

export default function ManageUserEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useUserDetail(id!);
  const { mutate: updateUser, isPending } = useUpdateUser();
  const { data: roles = [] } = useRoles();

  const handleSubmit = (data: UpdateUserDto) => {
    updateUser({ id: id!, data });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy user</p>
        <Button asChild>
          <Link to="/admin/users">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/users">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Chỉnh sửa thông tin</h2>

      <UserForm
        defaultValues={{
          status: (user.status ?? 1) as 0 | 1,
          roleName:
            user.roleName ||
            user.role ||
            (user.roles && user.roles[0]?.name) ||
            "",
          username: user.username,
          fullName: user.fullName ?? "",
          gender: user.gender ?? "M",
          email: user.email,
          birthday: user.birthday ?? "",
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Cập nhật"
        isEdit
        roles={roles}
      />
    </div>
  );
}
