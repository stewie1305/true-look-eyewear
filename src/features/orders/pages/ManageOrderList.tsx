import { useCallback, useEffect, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useDebounce } from "@/shared/hooks/useDebounce";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  EmptyState,
  LoadingSpinner,
  Pagination,
} from "@/shared/components/common";
import { OrderTable } from "../components/OrderTable";
import {
  useDeleteOrder,
  useOrders,
  useUpdateOrderStatus,
} from "../hooks/useOrders";
import type { Order, OrderStatus } from "../types";

export default function ManageOrderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, pagination, isLoading } = useOrders();
  const deleteMutation = useDeleteOrder();
  const updateStatusMutation = useUpdateOrderStatus();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  const updateSearchParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("search") || "")) {
      updateSearchParam(debouncedSearch);
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateStatusMutation.mutate({ id, data: { status } });
  };

  const ordersData = (Array.isArray(orders) ? orders : []) as Order[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Quản lý đơn hàng
        </h2>
        <p className="text-sm text-muted-foreground">
          Theo dõi danh sách đơn hàng và cập nhật trạng thái xử lý
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã đơn hoặc mã khách hàng..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(value) =>
            handleFilterChange("status", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : ordersData.length === 0 ? (
        <EmptyState
          title="Chưa có đơn hàng"
          description="Đơn hàng mới sẽ xuất hiện tại đây khi khách thanh toán"
        />
      ) : (
        <>
          <OrderTable
            orders={ordersData}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
            isDeleting={deleteMutation.isPending}
            isUpdatingStatus={updateStatusMutation.isPending}
          />

          {pagination && pagination.totalPages > 1 && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
