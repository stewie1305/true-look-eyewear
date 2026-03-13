import { CheckCircle2, Truck, XCircle } from "lucide-react";

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
  onCancel: (id: string) => void;
  isUpdating?: boolean;
  isCancelling?: boolean;
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
  onCancel,
  isUpdating,
  isCancelling,
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

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(order.id, "Shipping")}
                    disabled={
                      isUpdating ||
                      order.status === "Shipping" ||
                      order.status === "Cancel"
                    }
                  >
                    <Truck className="mr-1 h-3 w-3" />
                    Shipping
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => onCancel(order.id)}
                    disabled={isCancelling || order.status === "Cancel"}
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    Hủy
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
