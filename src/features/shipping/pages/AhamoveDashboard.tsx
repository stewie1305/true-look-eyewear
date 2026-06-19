import { useMemo } from "react";
import { BarChart3, Package, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LoadingSpinner } from "@/shared/components/common";
import { useAhamoveOrders } from "../hooks/useShippingAdmin";

export default function AhamoveDashboard() {
  const { data: orders, isLoading, error } = useAhamoveOrders();

  const stats = useMemo(() => {
    if (!orders) return { totalCod: 0, totalShip: 0, totalOrders: 0 };

    // Filter orders from June 3, 2026 onwards
    const filterDate = new Date("2026-06-03T00:00:00+07:00");

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.create_at);
      return orderDate >= filterDate && order.status !== "CANCELLED";
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
  }, [orders]);

  if (isLoading) return <LoadingSpinner className="py-20" size="lg" />;

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
          Tổng hợp tiền hàng và tiền ship từ ngày 03/06/2026 (không tính đơn đã hủy)
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
      </div>
    </div>
  );
}
