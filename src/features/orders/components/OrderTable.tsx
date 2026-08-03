import { CheckCircle2, Loader2 } from "lucide-react";

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
  updatingId?: string | null;
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

const getDisplayStatus = (status?: string | null) => {
  if (!status) return "Pending";
  if (status === "SHIPPING_FAILED") return "Cancel";
  return status;
};

export function OrderTable({
  orders,
  onUpdateStatus,
  isUpdating,
  updatingId,
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
                <Badge variant={statusVariant[getDisplayStatus(order.status)] ?? "outline"}>
                  {getDisplayStatus(order.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {order.create_at
                  ? new Date(order.create_at).toLocaleString("vi-VN", { timeZone: "UTC" })
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  {order.status !== "Complete" &&
                   order.status !== "Completed" &&
                   order.status !== "Shipping_Failed" &&
                   order.status !== "SHIPPING_FAILED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(order.id, "Confirm")}
                      disabled={
                        isUpdating ||
                        !!updatingId ||
                        order.status === "Confirm" ||
                        order.status === "Shipping" ||
                        order.status === "Cancel"
                      }
                    >
                      {updatingId === order.id ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Đang xử lý
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Confirm
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
