import { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search, Ruler } from "lucide-react";

import { useFrameSpecs, useDeleteFrameSpec } from "../hooks/useFrameSpecs";
import { FrameSpecTable } from "../components/FrameSpecTable";
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
import type { FrameSpec } from "../types";

export default function ManageFrameSpecList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { frameSpecs, pagination, isLoading } = useFrameSpecs();
  const deleteMutation = useDeleteFrameSpec();

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

  const frameSpecData = (Array.isArray(frameSpecs) ? frameSpecs : []) as FrameSpec[];

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Ruler className="h-6 w-6" />
            Quản lý Gọng kính
          </h2>
          <p className="text-sm text-muted-foreground">
            Tạo, sửa, xoá thông số gọng kính trong hệ thống
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/frame-specs/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo gọng kính
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo product id, loại, chất liệu, dáng..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Input
          value={searchParams.get("product_id") || ""}
          onChange={(e) =>
            handleFilterChange("product_id", e.target.value || undefined)
          }
          placeholder="Lọc theo product id"
          className="md:w-52"
        />

        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(value) =>
            handleFilterChange("status", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-44">
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
      ) : frameSpecData.length === 0 ? (
        <EmptyState
          title="Chưa có gọng kính"
          description="Hãy tạo gọng kính đầu tiên của bạn"
        >
          <Button asChild>
            <Link to="/admin/frame-specs/create">
              <Plus className="mr-2 h-4 w-4" />
              Tạo gọng kính
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <FrameSpecTable
            frameSpecs={frameSpecData}
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
