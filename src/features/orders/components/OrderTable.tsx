import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

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
import type { Order, OrderStatus } from "../types";

interface OrderTableProps {
  orders: Order[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  isDeleting?: boolean;
  isUpdatingStatus?: boolean;
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  processing: "secondary",
  paid: "default",
  completed: "default",
  cancelled: "destructive",
};

const statusOptions: OrderStatus[] = [
  "Pending",
  "Processing",
  "Paid",
  "Completed",
  "Cancelled",
];

export function OrderTable({
  orders,
  onDelete,
  onUpdateStatus,
  isDeleting,
  isUpdatingStatus,
}: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead className="text-right">Tổng tiền</TableHead>
            <TableHead className="text-right">Phí phụ thu</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const currentStatus = String(order.status || "Pending");
            return (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {order.customer?.fullName ||
                        order.customer?.username ||
                        "—"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {order.customer_id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {Number(order.total || 0).toLocaleString("vi-VN")}đ
                </TableCell>
                <TableCell className="text-right">
                  {Number(order.extra_fee || 0).toLocaleString("vi-VN")}đ
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        statusVariant[currentStatus.toLowerCase()] ?? "outline"
                      }
                    >
                      {currentStatus}
                    </Badge>

                    <select
                      className="h-8 rounded-md border bg-background px-2 text-xs"
                      value={currentStatus}
                      onChange={(e) =>
                        onUpdateStatus(order.id, e.target.value as OrderStatus)
                      }
                      disabled={isUpdatingStatus}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </TableCell>
                <TableCell>
                  {order.create_at
                    ? new Date(order.create_at).toLocaleString("vi-VN")
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/orders/${order.id}`}>
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
                            `Bạn có chắc muốn xóa đơn #${order.id}?`,
                          )
                        ) {
                          onDelete(order.id);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
