import { useMemo, useEffect, useState } from "react";
import { Shield, RefreshCcw, Users } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Label } from "@/shared/components/ui/label";
import {
  LoadingSpinner,
  EmptyState,
} from "@/shared/components/common";
import { UserRoleTable } from "../components/UserRoleTable";
import {
  useUserRoles,
  useUserRolesByUser,
  useRemoveUserRole,
  useSyncUserRoles,
  useUsersWithRoles,
} from "../hooks/useUserRoles";
import type { UserRole, UserWithRoles } from "../types";

const getRoleId = (role: UserRole) => String(role.id ?? role.name ?? "");
const getRoleName = (role: UserRole) => String(role.name ?? role.id ?? "-");

export default function ManageUserRoleList() {
  const [searchParams] = useSearchParams();
  const { roles, isLoading } = useUserRoles();
  const { users, isLoading: isLoadingUsers } = useUsersWithRoles();
  const syncMutation = useSyncUserRoles();
  const removeMutation = useRemoveUserRole();

  const [userSearchInput, setUserSearchInput] = useState("");
  const [activeUserId, setActiveUserId] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  const {
    roles: userRoles,
    isLoading: isLoadingUserRoles,
  } = useUserRolesByUser(activeUserId);

  useEffect(() => {
    const userIdParam = searchParams.get("userId");
    const qParam = searchParams.get("q");
    if (!userIdParam) return;
    setActiveUserId(userIdParam);
    if (qParam) {
      setUserSearchInput(qParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!activeUserId || userSearchInput.trim()) return;
    const selected = users.find((u) => String(u.id) === String(activeUserId));
    if (!selected) return;
    const label =
      selected.fullName || selected.username || selected.email || selected.id;
    setUserSearchInput(String(label));
  }, [activeUserId, userSearchInput, users]);

  useEffect(() => {
    if (!activeUserId) return;
    const roleIds = userRoles.map((role) => getRoleId(role)).filter(Boolean);
    setSelectedRoleIds(roleIds);
  }, [activeUserId, userRoles]);

  const filteredRoles = useMemo(() => roles, [roles]);

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  const filteredUsers = useMemo(() => {
    const needle = userSearchInput.trim().toLowerCase();
    if (!needle) return [];
    return users
      .filter((u) => {
        const username = String(u.username ?? "").toLowerCase();
        const fullName = String(u.fullName ?? "").toLowerCase();
        const email = String(u.email ?? "").toLowerCase();
        return (
          username.includes(needle) ||
          fullName.includes(needle) ||
          email.includes(needle)
        );
      })
      .slice(0, 8);
  }, [users, userSearchInput]);

  const selectedUser = useMemo<UserWithRoles | undefined>(() => {
    return users.find((u) => String(u.id) === String(activeUserId));
  }, [users, activeUserId]);

  const handleSelectUser = (user: UserWithRoles) => {
    setActiveUserId(String(user.id));
    const label = user.fullName || user.username || user.email || user.id;
    setUserSearchInput(String(label));
  };

  const handleApplyUserName = () => {
    const needle = userSearchInput.trim().toLowerCase();
    if (!needle) return;
    const found =
      users.find(
        (u) =>
          String(u.fullName ?? "").toLowerCase() === needle ||
          String(u.username ?? "").toLowerCase() === needle ||
          String(u.email ?? "").toLowerCase() === needle,
      ) ??
      users.find((u) => {
        const username = String(u.username ?? "").toLowerCase();
        const fullName = String(u.fullName ?? "").toLowerCase();
        const email = String(u.email ?? "").toLowerCase();
        return (
          username.includes(needle) ||
          fullName.includes(needle) ||
          email.includes(needle)
        );
      });

    if (!found) {
      toast.error("Không tìm thấy nhân viên phù hợp");
      return;
    }
    handleSelectUser(found);
  };

  const handleSync = () => {
    if (!activeUserId) return;
    syncMutation.mutate({
      userId: activeUserId,
      data: { roleIds: selectedRoleIds },
    });
  };

  const handleRemoveRole = (roleId: string) => {
    if (!activeUserId) return;
    removeMutation.mutate({ userId: activeUserId, roleId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Quản lý phân quyền
          </h2>
          <p className="text-sm text-muted-foreground">
            Xem danh sách quyền và đồng bộ quyền cho nhân viên
          </p>
        </div>
      </div>

      <Card className="p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="userName">Tên nhân viên</Label>
            <Input
              id="userName"
              placeholder="Nhập tên/username/email để tải quyền"
              value={userSearchInput}
              onChange={(e) => setUserSearchInput(e.target.value)}
            />
            {isLoadingUsers ? (
              <p className="text-xs text-muted-foreground">Đang tải danh sách nhân viên...</p>
            ) : filteredUsers.length > 0 ? (
              <div className="rounded-md border bg-background shadow-sm">
                <ul className="max-h-48 overflow-auto">
                  {filteredUsers.map((user) => {
                    const label =
                      user.fullName || user.username || user.email || user.id;
                    return (
                      <li key={user.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectUser(user)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent"
                        >
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground">
                            {user.username ?? user.email ?? user.id}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
          <Button onClick={handleApplyUserName} className="md:w-40">
            <Users className="mr-2 h-4 w-4" />
            Tải quyền
          </Button>
        </div>

        {!activeUserId ? (
          <EmptyState
            title="Chưa chọn nhân viên"
            description="Nhập tên nhân viên để xem và đồng bộ quyền."
            className="py-8"
          />
        ) : isLoadingUserRoles ? (
          <div className="py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Quyền hiện tại</h3>
                {selectedUser && (
                  <div className="text-sm text-muted-foreground">
                    {selectedUser.fullName ||
                      selectedUser.username ||
                      selectedUser.email}{" "}
                    • ID: {selectedUser.id}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={handleSync}
                disabled={syncMutation.isPending}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Đồng bộ quyền
              </Button>
            </div>

            {userRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nhân viên này chưa có quyền nào.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userRoles.map((role) => {
                  const roleId = getRoleId(role);
                  return (
                    <Badge
                      key={roleId}
                      variant="secondary"
                      className="gap-2"
                    >
                      {getRoleName(role)}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(roleId)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                        disabled={removeMutation.isPending}
                      >
                        Xóa
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            onClick={handleSync}
            disabled={!activeUserId || syncMutation.isPending}
          >
            Đồng bộ quyền đã chọn
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : filteredRoles.length === 0 ? (
          <EmptyState
            title="Chưa có quyền"
            description="Danh sách quyền đang trống."
          />
        ) : (
          <UserRoleTable
            roles={filteredRoles}
            selectedRoleIds={selectedRoleIds}
            onToggle={handleToggleRole}
            disabled={!activeUserId}
          />
        )}
      </div>
    </div>
  );
}
