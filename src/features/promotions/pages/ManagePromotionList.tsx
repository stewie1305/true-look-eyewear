import { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search, Tag } from "lucide-react";

import { usePromotions, useDeletePromotion } from "../hooks/usePromotions";
import { PromotionTable } from "../components/PromotionTable";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  LoadingSpinner,
  EmptyState,
  Pagination,
} from "@/shared/components/common";
import type { Promotion } from "../types";

export default function ManagePromotionList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { promotions, pagination, isLoading } = usePromotions();
  const deleteMutation = useDeletePromotion();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("name") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 500);

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

  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("name") || "")) {
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

  const promotionsData = (
    Array.isArray(promotions) ? promotions : []
  ) as Promotion[];

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="h-6 w-6" />
            Quản lý khuyến mãi
          </h2>
          <p className="text-sm text-muted-foreground">
            Tạo, cập nhật và quản lý các chương trình khuyến mãi
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/promotions/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo khuyến mãi
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khuyến mãi..."
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
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : promotionsData.length === 0 ? (
        <EmptyState
          title="Chưa có khuyến mãi"
          description="Hãy tạo khuyến mãi đầu tiên của bạn"
        >
          <Button asChild>
            <Link to="/admin/promotions/create">
              <Plus className="mr-2 h-4 w-4" />
              Tạo khuyến mãi
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <PromotionTable
            promotions={promotionsData}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />

          {pagination && pagination.totalPages > 1 && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
