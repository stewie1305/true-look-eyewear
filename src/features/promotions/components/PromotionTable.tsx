import { Link } from "react-router-dom";
import { Pencil, Trash2, BadgePercent } from "lucide-react";

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
import type { Promotion } from "../types";

interface PromotionTableProps {
  promotions: Promotion[];
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  showActions?: boolean;
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  Active: "default",
  inactive: "secondary",
  Inactive: "secondary",
};

const statusLabel = (value: string) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "inactive") return "Inactive";
  return value;
};

export function PromotionTable({
  promotions,
  onDelete,
  isDeleting,
  showActions = true,
}: PromotionTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên khuyến mãi</TableHead>
            <TableHead>Điều kiện</TableHead>
            <TableHead>Giảm giá</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Trạng thái</TableHead>
            {showActions && <TableHead className="text-right">Thao tác</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-4 w-4 text-muted-foreground" />
                  {promo.name}
                </div>
              </TableCell>
              <TableCell>
                {Number(promo.condition || 0).toLocaleString("vi-VN")}đ
              </TableCell>
              <TableCell>
                {Number(promo.discount || 0).toLocaleString("vi-VN")}đ
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <div>{promo.start_time}</div>
                <div>{promo.end_time}</div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[promo.status] ?? "outline"}>
                  {statusLabel(promo.status)}
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/promotions/${promo.id}`}>
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
                            `Bạn có chắc muốn vô hiệu hóa "${promo.name}"?`,
                          )
                        ) {
                          onDelete?.(promo.id);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Vô hiệu
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
