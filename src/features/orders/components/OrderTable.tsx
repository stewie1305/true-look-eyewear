import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
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
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  isUpdating?: boolean;
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Pending: "secondary",
  Confirm: "default",
  Shipping: "outline",
  Cancel: "destructive",
  Completed: "default",
};

export function OrderTable({
  orders,
  onUpdateStatus,
  isUpdating,
}: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead className="text-right">Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>{order.customer_id}</TableCell>
              <TableCell className="text-right">
                {Number(order.total || 0).toLocaleString("vi-VN")}đ
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[order.status] ?? "outline"}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                {order.create_at
                  ? new Date(order.create_at).toLocaleString("vi-VN")
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(order.id, "Confirm")}
                    disabled={
                      isUpdating ||
                      order.status === "Confirm" ||
                      order.status === "Shipping" ||
                      order.status === "Cancel"
                    }
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Confirm
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
