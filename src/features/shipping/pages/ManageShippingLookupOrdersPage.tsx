import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, PlusCircle, RefreshCcw, Truck } from "lucide-react";

import { useNhanhOrders } from "@/features/shipping/hooks/useShippingAdmin";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { EmptyState, LoadingSpinner } from "@/shared/components/common";

const toDateInputValue = (value: Date) => value.toISOString().slice(0, 10);

const today = new Date();
const defaultFromDate = new Date();
defaultFromDate.setDate(today.getDate() - 7);

export default function ManageShippingLookupOrdersPage() {
  const [filters, setFilters] = useState({
    fromDate: toDateInputValue(defaultFromDate),
    toDate: toDateInputValue(today),
  });
  const [draftFilters, setDraftFilters] = useState(filters);

  const ordersQuery = useNhanhOrders(filters);

  const orders = useMemo(
    () => (Array.isArray(ordersQuery.data) ? ordersQuery.data : []),
    [ordersQuery.data],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Truck className="h-6 w-6" />
          Tra cứu đơn hàng Nhanh.vn
        </h2>
        <p className="text-sm text-muted-foreground">
          Đồng bộ và hiển thị danh sách đơn theo khoảng ngày.
        </p>
      </div>

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link to="/admin/shipping-orders/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo đơn
          </Link>
        </Button>
        <Button asChild variant="default">
          <Link to="/admin/shipping-orders/lookup">
            <ListChecks className="mr-2 h-4 w-4" />
            Tra cứu đơn Nhanh
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn Nhanh.vn</CardTitle>
          <CardDescription>
            Lọc theo ngày rồi bấm tra cứu để đồng bộ danh sách mới nhất.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="from-date">Từ ngày</Label>
              <Input
                id="from-date"
                type="date"
                value={draftFilters.fromDate}
                onChange={(e) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    fromDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-date">Đến ngày</Label>
              <Input
                id="to-date"
                type="date"
                value={draftFilters.toDate}
                onChange={(e) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    toDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setFilters(draftFilters)}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Tra cứu
              </Button>
            </div>
          </div>

          {ordersQuery.isLoading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <EmptyState
              title="Chưa có đơn Nhanh"
              description="Không tìm thấy đơn hàng nào trong khoảng ngày đã chọn."
            />
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border p-4 transition hover:border-primary/40"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName || "-"} •{" "}
                      {order.customerMobile || "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerAddress || "-"},{" "}
                      {order.customerDistrictName || "-"},{" "}
                      {order.customerCityName || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.carrierName || "-"} / {order.serviceName || "-"}
                      {order.status ? ` • ${order.status}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
