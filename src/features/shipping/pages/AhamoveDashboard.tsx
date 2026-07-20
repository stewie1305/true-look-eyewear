import { useMemo } from "react";
import { BarChart3, Package, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LoadingSpinner } from "@/shared/components/common";
import { useAhamoveOrders } from "../hooks/useShippingAdmin";
import { useOrdersAdmin } from "@/features/orders/hooks/useOrders";

export default function AhamoveDashboard() {
  const { data: orders, isLoading: isAhamoveLoading, error } = useAhamoveOrders();
  const { orders: appOrders, isLoading: isOrdersLoading } = useOrdersAdmin();

  const stats = useMemo(() => {
    if (!orders) return { totalCod: 0, totalShip: 0, totalOrders: 0 };

    // Filter orders from June 3, 2026 onwards
    const filterDate = new Date("2026-07-01T00:00:00+07:00");

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.create_at);
      const appOrder = appOrders?.find((o: any) => o.id === order.order_id);
      const status = appOrder ? appOrder.status : order.status;

      return (
        orderDate >= filterDate &&
        (status?.toLowerCase() === "completed" || status?.toLowerCase() === "complete")
      );
    });

    return filteredOrders.reduce(
      (acc, order) => {
        acc.totalCod += Number(order.cod_amount || 0);
        acc.totalShip += Number(order.ship_fee || 0);
        acc.totalOrders += 1;
        return acc;
      },
      { totalCod: 0, totalShip: 0, totalOrders: 0 }
    );
  }, [orders, appOrders]);

  const itemStats = useMemo(() => {
    let totalGlasses = 0;
    let totalCords = 0;
    const glassesBreakdown: Record<string, number> = {};

    if (!appOrders) return { totalGlasses, totalCords, glassesBreakdown };

    const filterDate = new Date("2026-07-01T00:00:00+07:00");
    const ahamoveOrderIds = new Set(orders?.map((o) => o.order_id) || []);

    const completedOrders = appOrders.filter((o: any) => {
      const isCompleted = o.status?.toLowerCase() === "completed" || o.status?.toLowerCase() === "complete";
      const orderDate = new Date(o.create_at);
      return isCompleted && orderDate >= filterDate && ahamoveOrderIds.has(o.id);
    });

    completedOrders.forEach((order: any) => {
      if (order.orderDetails && Array.isArray(order.orderDetails)) {
        order.orderDetails.forEach((detail: any) => {
          const name = detail.variant?.name?.toLowerCase() || "";
          const quantity = Number(detail.quantity || 0);

          if (name.includes("dây kính") || name.includes("dây")) {
            totalCords += quantity;
          } else if (name.includes("kính") || name.includes("gọng")) {
            totalGlasses += quantity;
            const rawName = detail.variant?.name || "Kính không xác định";
            glassesBreakdown[rawName] = (glassesBreakdown[rawName] || 0) + quantity;
          }
        });
      }
    });

    return { totalGlasses, totalCords, glassesBreakdown };
  }, [appOrders, orders]);

  if (isAhamoveLoading || isOrdersLoading) return <LoadingSpinner className="py-20" size="lg" />;

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu thống kê
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Thống kê Ahamove
        </h2>
        <p className="text-sm text-muted-foreground">
          Tổng hợp tiền hàng và tiền ship từ ngày 03/06/2026 (chỉ tính đơn giao thành công)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Tiền Hàng</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalCod.toLocaleString("vi-VN")}đ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Tiền Ship</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalShip.toLocaleString("vi-VN")}đ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số Lượng Đơn</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số Kính Đã Bán</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {itemStats.totalGlasses}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số Dây Kính Đã Bán</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {itemStats.totalCords}
            </div>
          </CardContent>
        </Card>
      </div>

      {Object.keys(itemStats.glassesBreakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chi tiết các loại kính đã bán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(itemStats.glassesBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-sm text-muted-foreground font-semibold">{count} chiếc</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
