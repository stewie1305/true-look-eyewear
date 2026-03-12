import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  useOrderDetail,
  useUpdateOrder,
  useUpdateOrderStatus,
} from "../hooks/useOrders";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Paid",
  "Completed",
  "Cancelled",
];

export default function ManageOrderEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrderDetail(id!);

  const updateOrderMutation = useUpdateOrder();
  const updateStatusMutation = useUpdateOrderStatus();

  const [extraFee, setExtraFee] = useState(0);
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    if (!order) return;
    setExtraFee(Number(order.extra_fee || 0));
    setStatus(String(order.status || "Pending"));
  }, [order]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy đơn hàng</p>
        <Button asChild>
          <Link to="/admin/orders">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const handleUpdateOrder = () => {
    updateOrderMutation.mutate({
      id: order.id,
      data: {
        extra_fee: Number(extraFee),
      },
    });
  };

  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({
      id: order.id,
      data: {
        status,
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/admin/orders">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <div>
        <h2 className="text-2xl font-bold">Chỉnh sửa đơn hàng</h2>
        <p className="text-sm text-muted-foreground">Mã đơn: {order.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cập nhật phí phụ thu</CardTitle>
          <CardDescription>
            Điều chỉnh phí phụ thu cho đơn hàng hiện tại
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            min={0}
            value={extraFee}
            onChange={(e) => setExtraFee(Number(e.target.value))}
          />
          <Button
            onClick={handleUpdateOrder}
            disabled={updateOrderMutation.isPending}
          >
            {updateOrderMutation.isPending
              ? "Đang cập nhật..."
              : "Lưu phí phụ thu"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cập nhật trạng thái</CardTitle>
          <CardDescription>
            Thay đổi trạng thái xử lý của đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {ORDER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <Button
            variant="secondary"
            onClick={handleUpdateStatus}
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending
              ? "Đang cập nhật..."
              : "Lưu trạng thái"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
