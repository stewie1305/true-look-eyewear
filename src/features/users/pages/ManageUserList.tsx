import { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";

import {
  useUsers,
  useDeleteUser,
  useRoles,
  useUserDetail,
} from "../hooks/useUsers";
import { UserTable } from "../components/UserTable";
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
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import type { User } from "../types";

export default function ManageUserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { users, pagination, isLoading } = useUsers();
  const { data: roles = [] } = useRoles();
  const roleOptions = roles.filter((r) => r?.name).map((r) => r.name);
  const deleteMutation = useDeleteUser();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: selectedUser, isLoading: isLoadingUser } = useUserDetail(
    selectedUserId || "",
  );

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

  const usersData = (Array.isArray(users) ? users : []) as User[];

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  const handleView = (id: string) => {
    setSelectedUserId(id);
  };
  const closeView = () => setSelectedUserId(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Quản lý nhân viên
          </h2>
          <p className="text-sm text-muted-foreground">
            Tạo, sửa, khóa tài khoản trong hệ thống
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/users/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo user
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tên đăng nhập, email..."
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
            <SelectItem value="1">Hoạt động</SelectItem>
            <SelectItem value="0">Khóa</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("roleName") || "all"}
          onValueChange={(value) =>
            handleFilterChange("roleName", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            {roleOptions.length === 0 ? (
              <SelectItem value="__empty" disabled>
                Không có vai trò
              </SelectItem>
            ) : (
              roleOptions.map((roleName) => (
                <SelectItem key={roleName} value={roleName}>
                  {roleName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : usersData.length === 0 ? (
        <EmptyState title="Chưa có user" description="Hãy tạo user đầu tiên.">
          <Button asChild>
            <Link to="/admin/users/create">
              <Plus className="mr-2 h-4 w-4" />
              Tạo user
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <UserTable
            users={usersData}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
            onView={handleView}
          />

          {pagination && pagination.totalPages > 1 && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}

      {selectedUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg mx-4 p-6 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
              <button
                type="button"
                onClick={closeView}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Đóng
              </button>
            </div>

            {isLoadingUser ? (
              <LoadingSpinner />
            ) : !selectedUser ? (
              <p className="text-sm text-muted-foreground">
                Không tìm thấy thông tin người dùng.
              </p>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label>Tên đăng nhập</Label>
                  <p className="font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <Label>Họ tên</Label>
                  <p className="font-medium">{selectedUser.fullName || "-"}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Giới tính</Label>
                    <p className="font-medium">{selectedUser.gender || "-"}</p>
                  </div>
                  <div>
                    <Label>Ngày sinh</Label>
                    <p className="font-medium">
                      {selectedUser.birthday || "-"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Vai trò</Label>
                    <p className="font-medium">
                      {selectedUser.roleName ||
                        (typeof selectedUser.role === "string"
                          ? selectedUser.role
                          : selectedUser.role?.name) ||
                        selectedUser.roles?.[0]?.name ||
                        selectedUser.userRoles?.[0]?.role?.name ||
                        "-"}
                    </p>
                  </div>
                  <div>
                    <Label>Trạng thái</Label>
                    <p className="font-medium">
                      {String(selectedUser.status ?? "-")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
