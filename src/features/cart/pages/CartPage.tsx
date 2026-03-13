import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { LoadingSpinner, EmptyState } from "@/shared/components/common";
import { useAddresses } from "@/features/address/hooks/useAddresses";
import type { Address } from "@/features/address/types";
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
} from "../hooks/useCart";

export default function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const { items, totalItems, totalAmount, isLoading } = useCart();
  const { addresses, isLoading: isLoadingAddresses } = useAddresses();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveFromCart();

  useEffect(() => {
    if (!items.length) {
      setSelectedItemIds([]);
      return;
    }

    setSelectedItemIds((prev) => {
      if (!prev.length) {
        return items.map((item) => item.id);
      }

      const validIds = new Set(items.map((item) => item.id));
      return prev.filter((id) => validIds.has(id));
    });
  }, [items]);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedItemIds.includes(item.id)),
    [items, selectedItemIds],
  );

  const selectedTotalAmount = useMemo(
    () =>
      selectedItems.reduce((sum, item) => {
        const price = Number(item.variant?.price || 0);
        return sum + price * item.quantity;
      }, 0),
    [selectedItems],
  );

  const isAllSelected =
    items.length > 0 && selectedItemIds.length === items.length;

  const toggleSelectItem = (id: string, checked: boolean) => {
    setSelectedItemIds((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((itemId) => itemId !== id);
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedItemIds(checked ? items.map((item) => item.id) : []);
  };

  useEffect(() => {
    const state = location.state as {
      autoCheckout?: boolean;
      checkoutWithAddress?: Address;
      selectedCartItemIds?: string[];
    } | null;

    if (!state?.autoCheckout || !state.checkoutWithAddress) return;

    navigate("/checkout", {
      replace: true,
      state: {
        checkoutWithAddress: state.checkoutWithAddress,
        selectedCartItemIds: state.selectedCartItemIds,
      },
    });
  }, [location.pathname, location.state, navigate]);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateMutation.mutate({ id, data: { quantity: newQuantity } });
  };

  const handleRemoveConfirm = (id: string, productName: string) => {
    setDeleteConfirm({ id, name: productName });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      removeMutation.mutate(deleteConfirm.id, {
        onSuccess: () => setDeleteConfirm(null),
      });
    }
  };

  const handleCheckout = () => {
    if (!selectedItemIds.length) {
      return;
    }

    if (!addresses.length) {
      navigate("/addresses", {
        state: {
          fromCheckout: true,
          returnTo: "/checkout",
          selectedCartItemIds: selectedItemIds,
        },
      });
      return;
    }

    navigate("/checkout", {
      state: {
        selectedCartItemIds: selectedItemIds,
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-2xl bg-linear-to-br from-primary/25 via-primary/10 to-transparent p-2.5 ring-1 ring-primary/20 shadow-sm">
            <ShoppingCart className="h-7 w-7 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Giỏ hàng của bạn
            </h1>
            <p className="text-muted-foreground">
              {totalItems} sản phẩm trong giỏ
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" asChild>
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tiếp tục mua sắm
          </Link>
        </Button>
      </div>

      {/* Content */}
      {!items?.length ? (
        <EmptyState
          title="Giỏ hàng trống"
          description="Bạn chưa có sản phẩm nào trong giỏ hàng."
        >
          <Button asChild>
            <Link to="/products">Khám phá sản phẩm</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
                Chọn tất cả sản phẩm
              </label>
              <span className="text-sm text-muted-foreground">
                Đã chọn {selectedItemIds.length}/{items.length}
              </span>
            </div>

            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={selectedItemIds.includes(item.id)}
                      onChange={(e) =>
                        toggleSelectItem(item.id, e.target.checked)
                      }
                    />
                  </div>

                  {/* Image */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.variant?.images?.[0]?.path ? (
                      <img
                        src={item.variant.images[0].path}
                        alt={item.variant.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{item.variant?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.variant?.code}
                        </p>

                        {item.variant?.color && (
                          <Badge variant="outline" className="mt-1">
                            {item.variant.color}
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleRemoveConfirm(item.id, item.variant?.name || "")
                        }
                        disabled={removeMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={
                            item.quantity <= 1 || updateMutation.isPending
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={updateMutation.isPending}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold">
                          {Number(item.variant?.price || 0).toLocaleString(
                            "vi-VN",
                          )}
                          đ
                        </p>

                        <p className="text-xs text-muted-foreground">
                          x {item.quantity} ={" "}
                          {(
                            Number(item.variant?.price || 0) * item.quantity
                          ).toLocaleString("vi-VN")}
                          đ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Tổng đơn hàng</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tạm tính đã chọn
                  </span>
                  <span className="font-medium">
                    {selectedTotalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="font-medium">Miễn phí</span>
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Tổng cộng</span>

                  <span className="text-xl font-bold text-primary">
                    {selectedTotalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoadingAddresses || !selectedItemIds.length}
              >
                Thanh toán
              </Button>

              <Button variant="outline" className="w-full mt-2" asChild>
                <Link to="/products">Tiếp tục mua sắm</Link>
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-sm mx-4 p-6 shadow-xl rounded-2xl">
            <div className="flex items-start gap-4 mb-5">
              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>

              {/* Text */}
              <div>
                <h2 className="font-semibold text-sm">Xóa sản phẩm?</h2>

                <p className="text-xs text-muted-foreground mt-1">
                  Bạn có chắc muốn xóa "{deleteConfirm.name}" khỏi giỏ hàng?
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirm(null)}
                disabled={removeMutation.isPending}
              >
                Hủy
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                disabled={removeMutation.isPending}
              >
                {removeMutation.isPending ? "Đang xóa..." : "Xóa"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
