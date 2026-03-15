import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";

import { EmptyState, LoadingSpinner } from "@/shared/components/common";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useUserMe } from "@/features/users/hooks/useUsers";
import { useMyOrders } from "../hooks/useOrders";

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

export default function MyOrdersPage() {
  const { data: currentUser, isLoading: isLoadingUser } = useUserMe();
  const { orders, isLoading } = useMyOrders(currentUser?.id);
  const displayOrders = orders.filter((order) => {
    const normalizedStatus = String(order.status || "pending").toLowerCase();
    const isCanceledByStatus = ["cancel", "cancelled", "canceled"].includes(
      normalizedStatus,
    );

    return !isCanceledByStatus;
  });

  if (isLoadingUser || isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (!displayOrders.length) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <EmptyState
          title="Bạn chưa có đơn hàng"
          description="Sau khi đặt hàng hoặc thanh toán thành công, đơn hàng sẽ xuất hiện ở đây."
        >
          <Button asChild>
            <Link to="/cart">Đi tới giỏ hàng</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-4">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
      </div>

      {displayOrders.map((order) => (
        <Link
          key={order.id}
          to={`/orders/${order.id}`}
          state={{ order }}
          className="block"
        >
          <Card className="p-5 transition hover:border-primary/50 hover:bg-muted/20">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                <p className="font-semibold">#{order.id}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p className="font-medium">
                  {order.create_at
                    ? new Date(order.create_at).toLocaleString("vi-VN")
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tổng tiền</p>
                <p className="font-semibold text-primary">
                  {Number(order.total || 0).toLocaleString("vi-VN")}đ
                </p>
              </div>

              <Badge variant={statusVariant[order.status] ?? "outline"}>
                {order.status}
              </Badge>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
