import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, BadgePercent } from "lucide-react";

import { usePromotions } from "../hooks/usePromotions";
import { PromotionTable } from "../components/PromotionTable";
import { Input } from "@/shared/components/ui/input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { LoadingSpinner, EmptyState, Pagination } from "@/shared/components/common";
import type { Promotion } from "../types";

export default function PromotionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { promotions, pagination, isLoading } = usePromotions();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("name") || "",
  );
  const [moneyInput, setMoneyInput] = useState(
    searchParams.get("money") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 500);
  const debouncedMoney = useDebounce(moneyInput, 500);

  const updateSearchParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("name", value);
      } else {
        params.delete("name");
      }
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const updateMoneyParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("money", value);
      } else {
        params.delete("money");
      }
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== searchParams.get("name")) {
      updateSearchParam(debouncedSearch);
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (debouncedMoney !== searchParams.get("money")) {
      updateMoneyParam(debouncedMoney);
    }
  }, [debouncedMoney]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  const promotionsData = (Array.isArray(promotions) ? promotions : []) as Promotion[];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BadgePercent className="h-6 w-6" />
          Mã khuyến mãi
        </h2>
        <p className="text-sm text-muted-foreground">
          Danh sách mã khuyến mãi đang hoạt động
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên khuyến mãi..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="md:w-64">
          <Input
            type="number"
            min={0}
            placeholder="Số tiền đơn hàng"
            value={moneyInput}
            onChange={(e) => setMoneyInput(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : promotionsData.length === 0 ? (
        <EmptyState
          title="Chưa có khuyến mãi"
          description="Hiện chưa có mã khuyến mãi phù hợp."
        />
      ) : (
        <>
          <PromotionTable promotions={promotionsData} showActions={false} />

          {pagination && pagination.totalPages > 1 && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
