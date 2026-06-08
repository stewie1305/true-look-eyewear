import { ClipboardList, ExternalLink, Package } from "lucide-react";
import { Link } from "react-router-dom";

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
import { EmptyState, LoadingSpinner } from "@/shared/components/common";
import { useAhamoveOrders, useCancelAhamoveOrder } from "../hooks/useShippingAdmin";

export default function ManageAhamoveOrders() {
  const { data: orders, isLoading, error } = useAhamoveOrders();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Pending":
      case "ASSIGNING":
        return "secondary";
      case "ACCEPTED":
      case "IN PROCESS":
        return "default";
      case "COMPLETED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const cancelMutation = useCancelAhamoveOrder();

  const handleCancelOrder = (_orderId: string, nhanhId: string | null) => {
    if (!nhanhId) return;
    const comment = window.prompt("Nhập lý do hủy đơn:");
    if (comment) {
      cancelMutation.mutate({ order_id: nhanhId, comment });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6" />
          Quản lý Đơn giao Ahamove
        </h2>
        <p className="text-sm text-muted-foreground">
          Xem danh sách đơn giao hàng qua Ahamove
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-20" size="lg" />
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          Có lỗi xảy ra khi tải dữ liệu đơn giao hàng
        </div>
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          title="Chưa có đơn giao hàng"
          description="Hiện tại chưa có đơn giao hàng Ahamove nào"
        />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Mã Ahamove / Tracking</TableHead>
                <TableHead className="text-right">Tiền thu hộ (COD)</TableHead>
                <TableHead className="text-right">Phí Ship</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <Link
                      to={`/admin/orders?search=${order.order_id}`}
                      className="text-primary hover:underline"
                    >
                      #{order.order_id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {order.nhanh_id ? (
                      <span className="font-mono text-sm">{order.nhanh_id}</span>
                    ) : (
                      <span className="text-muted-foreground italic">Đang cập nhật</span>
                    )}
                    {order.tracking_url && (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 inline-flex items-center text-xs text-blue-500 hover:underline"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" /> Tracking
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    {order.cod_amount?.toLocaleString("vi-VN")}đ
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {order.ship_fee?.toLocaleString("vi-VN")}đ
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.create_at).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/orders?search=${order.order_id}`}>
                          <Package className="mr-2 h-4 w-4" />
                          Chi tiết đơn gốc
                        </Link>
                      </Button>
                      {order.status !== "CANCELLED" && order.status !== "COMPLETED" && order.nhanh_id && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          disabled={cancelMutation.isPending}
                          onClick={() => handleCancelOrder(order.id, order.nhanh_id)}
                        >
                          Hủy đơn
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
