import { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search, Tag } from "lucide-react";

import { useCategories, useDeleteCategory } from "../hooks/useCategories";
import { CategoryTable } from "../components/CategoryTable";
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
import type { Category } from "../types";

export default function ManageCategoryList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { categories, pagination, isLoading } = useCategories();
  const deleteMutation = useDeleteCategory();

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
    if (debouncedSearch !== searchParams.get("search")) {
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

  const categoriesData = (
    Array.isArray(categories) ? categories : []
  ) as Category[];

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="h-6 w-6" />
            Quản lý danh mục
          </h2>
          <p className="text-sm text-muted-foreground">
            Tạo, sửa, xoá các danh mục trong hệ thống
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/categories/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo danh mục
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm danh mục..."
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

      {/* Loading */}
      {isLoading ? (
        <LoadingSpinner />
      ) : categoriesData.length === 0 ? (
        <EmptyState
          title="Chưa có danh mục"
          description="Hãy tạo danh mục đầu tiên của bạn"
        >
            <Button asChild>
              <Link to="/admin/categories/create">
                <Plus className="mr-2 h-4 w-4" />
                Tạo danh mục
              </Link>
            </Button>
        </EmptyState>
      ) : (
        <>
          {/* Table */}
          <CategoryTable
            categories={categoriesData}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
