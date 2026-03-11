import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { RoleForm } from "../components/RoleForm";
import { useRoleDetail, useUpdateRole } from "../hooks/useRoles";
import type { UpdateRoleDto } from "../types";

export default function ManageRoleEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: role, isLoading } = useRoleDetail(id!);
  const { mutate: updateRole, isPending } = useUpdateRole();

  const handleSubmit = (data: UpdateRoleDto) => {
    updateRole({ id: id!, data });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy quyền</p>
        <Button asChild>
          <Link to="/admin/roles">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/roles">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Chỉnh sửa quyền</h2>

      <RoleForm
        defaultValues={{
          name: role.name,
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
