import { Link } from "react-router-dom";
import { Pencil, Trash2, User as UserIcon } from "lucide-react";

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

const getRoleLabel = (user: User) => {
  if (user.roleName) return user.roleName;
  if (typeof user.role === "string") return user.role;
  if (typeof user.role === "object" && user.role?.name) return user.role.name;
  if (user.roles && user.roles.length > 0) return user.roles[0].name;
  if (user.userRoles && user.userRoles.length > 0) {
    return user.userRoles[0]?.role?.name ?? "-";
  }
  return "-";
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
              <TableCell>{getRoleLabel(user)}</TableCell>
              <TableCell>
                <Badge
                  variant={statusVariant[String(user.status)] ?? "outline"}
                >
                  {String(user.status ?? "")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
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
