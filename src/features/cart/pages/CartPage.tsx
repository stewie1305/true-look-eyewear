import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { LoadingSpinner, EmptyState } from "@/shared/components/common";
import { useAddresses } from "@/features/address/hooks/useAddresses";
import { useImageBlobUrl } from "@/features/images/hooks/useImages";
import type { Address } from "@/features/address/types";
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
} from "../hooks/useCart";

function CartItemImage({
  imageId,
  alt,
}: {
  imageId?: string | null;
  alt: string;
}) {
  const imageSrc = useImageBlobUrl(imageId);

  if (!imageSrc) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img src={imageSrc} alt={alt} className="h-full w-full object-cover" />
  );
}

export default function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const { items, totalItems, isLoading } = useCart();
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
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
              Giỏ hàng của bạn
            </h1>
            <Badge variant="default" className="text-sm md:text-base px-3 py-1 rounded-full shadow-sm mt-3">
              {totalItems} items
            </Badge>
          </div>
          <p className="text-muted-foreground text-base font-medium">
            Sẵn sàng để chốt đơn chưa? 🔥
          </p>
        </div>

        <Button variant="secondary" className="rounded-full shadow-sm px-6 py-5 font-semibold text-sm hover:scale-105 transition-transform" asChild>
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tiếp tục khám phá
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
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card p-4 shadow-sm">
              <button 
                type="button"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors focus:outline-none"
                onClick={() => toggleSelectAll(!isAllSelected)}
              >
                {isAllSelected ? (
                  <CheckCircle2 className="h-5 w-5 text-primary fill-primary/10" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                Chọn tất cả sản phẩm
              </button>
              <span className="text-sm text-muted-foreground">
                Đã chọn {selectedItemIds.length}/{items.length}
              </span>
            </div>

            {items.map((item) => (
              <Card key={item.id} className="p-4 rounded-xl border-border/40 shadow-sm transition-all hover:bg-muted/10">
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="pt-1 h-fit focus:outline-none hover:opacity-80 transition-opacity"
                    onClick={() => toggleSelectItem(item.id, !selectedItemIds.includes(item.id))}
                  >
                    {selectedItemIds.includes(item.id) ? (
                      <CheckCircle2 className="h-5 w-5 text-primary fill-primary/10" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>

                  {/* Image */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <CartItemImage
                      imageId={item.variant?.images?.[0]?.id}
                      alt={item.variant?.name || "Cart item"}
                    />
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
                      <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/50 p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full hover:bg-background"
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
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full hover:bg-background"
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
            <Card className="p-6 sticky top-28 rounded-xl border-border/40 shadow-sm bg-card/80 backdrop-blur-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
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
