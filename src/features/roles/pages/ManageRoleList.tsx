import { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search, Shield } from "lucide-react";

import { useRoles, useDeleteRole } from "../hooks/useRoles";
import { RoleTable } from "../components/RoleTable";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  LoadingSpinner,
  EmptyState,
  Pagination,
} from "@/shared/components/common";
import type { Role } from "../types";

export default function ManageRoleList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { roles, pagination, isLoading } = useRoles();
  const deleteMutation = useDeleteRole();

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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  const rolesData = (Array.isArray(roles) ? roles : []) as Role[];

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Quản lý quyền
          </h2>
          <p className="text-sm text-muted-foreground">
            Tạo, sửa, xóa các quyền trong hệ thống
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/roles/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo quyền
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên quyền..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : rolesData.length === 0 ? (
        <EmptyState
          title="Chưa có quyền"
          description="Hãy tạo quyền đầu tiên."
        >
          <Button asChild>
            <Link to="/admin/roles/create">
              <Plus className="mr-2 h-4 w-4" />
              Tạo quyền
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <RoleTable
            roles={rolesData}
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
