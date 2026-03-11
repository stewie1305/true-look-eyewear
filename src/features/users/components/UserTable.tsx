import { Link } from "react-router-dom";
import { Pencil, Trash2, User as UserIcon, Shield } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { User } from "../types";

interface UserTableProps {
  users: User[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  onView?: (id: string) => void;
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  Active: "default",
  inactive: "secondary",
  Inactive: "secondary",
  "0": "secondary",
  "1": "default",
};

const getRoleLabels = (user: User) => {
  const labels = new Set<string>();
  if (user.roleName) labels.add(user.roleName);
  if (typeof user.role === "string") labels.add(user.role);
  if (typeof user.role === "object" && user.role?.name) labels.add(user.role.name);
  if (Array.isArray(user.roles)) {
    user.roles.forEach((r) => {
      if (r?.name) labels.add(r.name);
    });
  }
  if (Array.isArray(user.userRoles)) {
    user.userRoles.forEach((ur) => {
      if (ur?.role?.name) labels.add(ur.role.name);
    });
  }
  return Array.from(labels).filter(Boolean);
};

export function UserTable({
  users,
  onDelete,
  isDeleting,
  onView,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên đăng nhập</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <button
                  type="button"
                  onClick={() => onView?.(user.id)}
                  className="flex items-center gap-2 text-left hover:underline"
                >
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  {user.username}
                </button>
              </TableCell>
              <TableCell>{user.fullName ?? "-"}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                {getRoleLabels(user).length === 0 ? (
                  "-"
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {getRoleLabels(user).map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[String(user.status)] ?? "outline"}>
                  {String(user.status ?? "")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      to={`/admin/user-roles?userId=${encodeURIComponent(
                        String(user.id),
                      )}&q=${encodeURIComponent(
                        String(user.fullName || user.username || user.email || ""),
                      )}`}
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      Phân quyền
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/users/${user.id}`}>
                      <Pencil className="mr-1 h-3 w-3" />
                      Sửa
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Bạn có chắc muốn khóa tài khoản "${user.username}"?`,
                        )
                      ) {
                        onDelete(user.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Khóa
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}