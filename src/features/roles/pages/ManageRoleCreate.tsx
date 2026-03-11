import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { RoleForm } from "../components/RoleForm";
import { useCreateRole } from "../hooks/useRoles";
import type { CreateRoleDto } from "../types";

export function ManageRoleCreate() {
  const { mutate: createRole, isPending } = useCreateRole();

  const handleSubmit = (data: CreateRoleDto) => {
    createRole(data);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/roles">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Tạo quyền mới</h2>

      <RoleForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo quyền"
      />
    </div>
  );
}

export default ManageRoleCreate;
