import { ShieldCheck } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { UserRole } from "../types";

interface UserRoleTableProps {
  roles: UserRole[];
  selectedRoleIds: string[];
  onToggle: (roleId: string) => void;
  disabled?: boolean;
}

export function UserRoleTable({
  roles,
  selectedRoleIds,
  onToggle,
  disabled = false,
}: UserRoleTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quyền</TableHead>
            <TableHead>Mã quyền</TableHead>
            <TableHead className="text-right">Chọn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => {
            const roleId = String(role.id ?? role.name);
            const isChecked = selectedRoleIds.includes(roleId);
            return (
              <TableRow key={roleId}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    {role.name || role.id}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{roleId}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={isChecked}
                    onChange={() => onToggle(roleId)}
                    disabled={disabled}
                    aria-label={`Chọn quyền ${role.name || role.id}`}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
