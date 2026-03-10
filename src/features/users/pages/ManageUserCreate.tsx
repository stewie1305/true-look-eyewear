import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { UserForm } from "../components/UserForm";
import { useCreateUser, useRoles } from "../hooks/useUsers";
import type { CreateUserDto } from "../types";

export function ManageUserCreate() {
  const { mutate: createUser, isPending } = useCreateUser();
  const { data: roles = [] } = useRoles();

  const handleSubmit = (data: CreateUserDto) => {
    createUser(data);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/users">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Tạo user mới</h2>

      <UserForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo user"
        roles={roles}
      />
    </div>
  );
}

export default ManageUserCreate;
