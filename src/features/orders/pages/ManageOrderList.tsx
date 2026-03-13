import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipboardList, Search } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { EmptyState, LoadingSpinner } from "@/shared/components/common";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { OrderTable } from "../components/OrderTable";
import { useOrdersAdmin, useUpdateOrderStatus } from "../hooks/useOrders";

export default function ManageOrderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  const { orders, isLoading } = useOrdersAdmin();
  const updateStatusMutation = useUpdateOrderStatus();

  const updateSearchParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("search") || "")) {
      updateSearchParam(debouncedSearch);
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6" />
          Quản lý đơn hàng
        </h2>
        <p className="text-sm text-muted-foreground">
          Xem danh sách đơn hàng và cập nhật trạng thái xử lý
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã đơn / khách hàng..."
              className="pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={handleFilterChange}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirm">Confirm</SelectItem>
            <SelectItem value="Shipping">Shipping</SelectItem>
            <SelectItem value="Cancel">Cancel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Chưa có đơn hàng"
          description="Hiện tại chưa có đơn hàng phù hợp bộ lọc"
        />
      ) : (
        <OrderTable
          orders={orders}
          onUpdateStatus={(id, status) =>
            updateStatusMutation.mutate({ id, status })
          }
          isUpdating={updateStatusMutation.isPending}
        />
      )}
    </div>
  );
}
