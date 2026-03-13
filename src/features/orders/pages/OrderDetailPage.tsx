import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ReceiptText } from "lucide-react";

import {
  LoadingSpinner,
  EmptyState,
  ErrorState,
} from "@/shared/components/common";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useUserMe } from "@/features/users/hooks/useUsers";
import { useOrderDetail } from "../hooks/useOrders";
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

export default function OrderDetailPage() {
  const { id = "" } = useParams();
  const { data: order, isLoading, error, refetch } = useOrderDetail(id);
  const { data: currentUser, isLoading: isLoadingUser } = useUserMe();
  const { orders, isLoading: isLoadingOrders } = useMyOrders(currentUser?.id);

  const summaryOrder = orders.find((item) => String(item.id) === String(id));
  const displayOrder = {
    id: order?.id || summaryOrder?.id || id,
    customer_id: order?.customer_id || summaryOrder?.customer_id || "",
    total: Number(order?.total || summaryOrder?.total || 0),
    extra_fee: Number(order?.extra_fee || summaryOrder?.extra_fee || 0),
    status: order?.status || summaryOrder?.status || "Pending",
    create_at: order?.create_at || summaryOrder?.create_at || "",
    update_at: order?.update_at || summaryOrder?.update_at || null,
  };

  if (isLoading || isLoadingUser || isLoadingOrders) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <ErrorState
          message="Không thể tải chi tiết đơn hàng. Vui lòng thử lại."
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  if (!order && !summaryOrder) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          title="Không tìm thấy đơn hàng"
          description="Đơn hàng không tồn tại hoặc bạn không có quyền xem."
        >
          <Button asChild>
            <Link to="/orders">Quay lại danh sách đơn hàng</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại đơn hàng của tôi
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5" />
            Chi tiết đơn hàng #{displayOrder.id}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Mã đơn hàng</p>
              <p className="mt-1 font-semibold">#{displayOrder.id}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Khách hàng</p>
              <p className="mt-1 font-medium">
                {displayOrder.customer_id || "-"}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Ngày tạo</p>
              <p className="mt-1 font-medium">
                {displayOrder.create_at
                  ? new Date(displayOrder.create_at).toLocaleString("vi-VN")
                  : "-"}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Cập nhật gần nhất</p>
              <p className="mt-1 font-medium">
                {displayOrder.update_at
                  ? new Date(displayOrder.update_at).toLocaleString("vi-VN")
                  : "-"}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Trạng thái</p>
              <div className="mt-1">
                <Badge
                  variant={statusVariant[displayOrder.status] ?? "outline"}
                >
                  {displayOrder.status}
                </Badge>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Phí phát sinh</p>
              <p className="mt-1 font-medium">
                {Number(displayOrder.extra_fee || 0).toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Tổng tiền</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {Number(displayOrder.total || 0).toLocaleString("vi-VN")}đ
            </p>
          </div>

          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-sm font-semibold">Sản phẩm đã mua</p>

            {Array.isArray(order?.items) && order.items.length > 0 ? (
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id || `${item.variant_id}-${item.order_id}`}
                    className="rounded-md border p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.variant_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Variant ID: {item.variant_id}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {(
                          Number(item.price) * Number(item.quantity)
                        ).toLocaleString("vi-VN")}
                        đ
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Đơn giá:{" "}
                        {Number(item.price || 0).toLocaleString("vi-VN")}đ
                      </span>
                      <span>SL: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa có danh sách sản phẩm trong chi tiết đơn hàng.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
