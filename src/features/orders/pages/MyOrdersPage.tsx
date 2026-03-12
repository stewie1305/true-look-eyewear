import { Package } from "lucide-react";
import { Link } from "react-router-dom";

import { useUserMe } from "@/features/users/hooks/useUsers";
import { useOrdersByUser } from "../hooks/useOrders";
import {
  EmptyState,
  ErrorState,
  LoadingSpinner,
} from "@/shared/components/common";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export default function MyOrdersPage() {
  const { data: me } = useUserMe();
  const { data: orders = [], isLoading, error } = useOrdersByUser(me?.id);

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (error) {
    return (
      <ErrorState
        message={
          error instanceof Error
            ? error.message
            : "Không tải được đơn hàng, vui lòng thử lại"
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-7 w-7" />
          Đơn hàng của tôi
        </h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi trạng thái các đơn hàng đã tạo
        </p>
      </div>

      {!orders.length ? (
        <EmptyState
          title="Bạn chưa có đơn hàng"
          description="Hãy chọn sản phẩm và thanh toán để tạo đơn hàng đầu tiên"
        >
          <Button asChild>
            <Link to="/products">Mua sắm ngay</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Mã đơn</p>
                  <p className="font-mono text-sm">{order.id}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Tổng tiền</p>
                  <p className="font-semibold">
                    {Number(order.total || 0).toLocaleString("vi-VN")}đ
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Phí phụ thu</p>
                  <p>{Number(order.extra_fee || 0).toLocaleString("vi-VN")}đ</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Trạng thái</p>
                  <Badge variant="outline">{order.status || "Pending"}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
