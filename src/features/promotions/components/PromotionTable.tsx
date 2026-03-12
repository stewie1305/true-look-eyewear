import { Link } from "react-router-dom";
import { Pencil, Trash2, Tag } from "lucide-react";

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
  onDelete: (id: string) => void;
  isDeleting?: boolean;
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

const formatDate = (iso: string) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );

export function PromotionTable({
  promotions,
  onDelete,
  isDeleting,
}: PromotionTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên khuyến mãi</TableHead>
            <TableHead>Điều kiện (đơn tối thiểu)</TableHead>
            <TableHead>Giảm giá</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {promo.name}
                </div>
              </TableCell>
              <TableCell>{formatCurrency(promo.condition)}</TableCell>
              <TableCell>{formatCurrency(promo.discount)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(promo.start_time)} → {formatDate(promo.end_time)}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[promo.status] ?? "outline"}>
                  {promo.status}
                </Badge>
              </TableCell>
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
                          `Vô hiệu hóa khuyến mãi "${promo.name}"?`,
                        )
                      ) {
                        onDelete(promo.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Vô hiệu
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
