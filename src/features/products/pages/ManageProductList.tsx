import { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search, Package, Activity } from "lucide-react";

import { useProducts, useDeleteProduct } from "../hooks/useProducts";
import { ProductTable } from "../components/ProductTable";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
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
import type { ProductVariant } from "../types";

const PRODUCT_TYPES = [
  { value: "eyeglasses", label: "Kính mắt" },
  { value: "sunglasses", label: "Kính râm" },
  { value: "contact_lens", label: "Kính áp tròng" },
];

export default function ManageProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, pagination, isLoading } = useProducts();
  const deleteMutation = useDeleteProduct();

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

  const productsData = (
    Array.isArray(products) ? products : []
  ) as ProductVariant[];

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
          <p className="text-sm text-muted-foreground">
            Tạo, sửa, xoá các sản phẩm trong hệ thống
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo sản phẩm
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={searchParams.get("product_type") || "all"}
          onValueChange={(value) =>
            handleFilterChange(
              "product_type",
              value === "all" ? undefined : value,
            )
          }
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại sản phẩm</SelectItem>
            {PRODUCT_TYPES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(value) =>
            handleFilterChange("status", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
          </SelectContent>
        </Select>

        {pagination && (
          <Badge variant="secondary" className="ml-auto">
            Tổng: {pagination.totalItems}
          </Badge>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : !productsData.length ? (
        <EmptyState
          title="Chưa có sản phẩm nào"
          description="Bắt đầu bằng cách tạo sản phẩm đầu tiên."
        >
          <Button asChild>
            <Link to="/admin/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Tạo sản phẩm
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <ProductTable
            products={productsData}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />

          {pagination && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
