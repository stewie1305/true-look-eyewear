import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, MapPin, QrCode, TicketPercent } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

import { useCart } from "@/features/cart/hooks/useCart";
import { cartItemService } from "@/features/cart/services";
import { useAddresses } from "@/features/address/hooks/useAddresses";
import { promotionService } from "@/features/promotions/services";
import { useCreateOrder } from "@/features/orders/hooks/useOrders";
import { orderService } from "@/features/orders/services";
import {
  getPaymentQrValue,
  getPaymentRedirectUrl,
  useCreatePayment,
} from "@/features/payments/hooks/usePayments";
import { useAuthStore } from "@/features/auth/store";
import type { JwtPayload } from "@/features/auth/types";
import type { Promotion } from "@/features/promotions/types";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { LoadingSpinner, EmptyState } from "@/shared/components/common";

type PaymentMethod = "cod" | "bank_transfer";

// BE trả "Pending" sau khi thanh toán thành công qua webhook
const isPaidStatus = (status?: string) => {
  const v = String(status || "").toLowerCase();
  return (
    v === "paid" || v === "pending" || v === "completed" || v === "success"
  );
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const customerId = useMemo(() => {
    if (!accessToken) return undefined;
    try {
      const decoded = jwtDecode<JwtPayload & { id?: string; userId?: string }>(
        accessToken,
      );
      return decoded?.sub || decoded?.id || decoded?.userId;
    } catch {
      return undefined;
    }
  }, [accessToken]);

  const { items, totalAmount, isLoading: isCartLoading } = useCart();
  const { addresses, isLoading: isAddressLoading } = useAddresses();

  const { data: activePromotions = [], isLoading: isPromotionLoading } =
    useQuery({
      queryKey: ["checkout", "promotions"],
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      queryFn: async () => {
        const toList = (payload: any): Promotion[] =>
          Array.isArray(payload) ? payload : (payload?.data ?? []);

        const LIMIT = 50;
        const MAX_PAGES = 50;
        const fetchAllPages = async (
          fetcher: (params: { page: number; limit: number }) => Promise<any>,
        ) => {
          let page = 1;
          let collected: Promotion[] = [];
          const seenIds = new Set<string>();

          while (page <= MAX_PAGES) {
            const response = await fetcher({ page, limit: LIMIT });
            const list = toList(response);
            if (!list.length) break;

            let hasNewItem = false;
            for (const promotion of list) {
              if (!promotion?.id) continue;
              if (!seenIds.has(promotion.id)) {
                seenIds.add(promotion.id);
                hasNewItem = true;
              }
            }

            collected = [...collected, ...list];

            if (!hasNewItem && page > 1) break;
            page += 1;
          }

          return collected;
        };

        const collected = await fetchAllPages((params) =>
          promotionService.getAllActive(params),
        );

        const deduped = Array.from(
          new Map(
            collected.map((promotion) => [promotion.id, promotion] as const),
          ).values(),
        );

        const now = Date.now();
        const activeOnly = deduped.filter((promotion) => {
          const status = String(promotion?.status || "active").toLowerCase();
          if (status !== "active") return false;

          const start = new Date(promotion.start_time).getTime();
          const end = new Date(promotion.end_time).getTime();

          const afterStart = Number.isFinite(start) ? now >= start : true;
          const beforeEnd = Number.isFinite(end) ? now <= end : true;
          return afterStart && beforeEnd;
        });

        return activeOnly.sort((a, b) => {
          const timeA = new Date(a.start_time ?? 0).getTime();
          const timeB = new Date(b.start_time ?? 0).getTime();
          return timeB - timeA;
        });
      },
    });

  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreatePayment();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedPromotionId, setSelectedPromotionId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [createdOrderId, setCreatedOrderId] = useState<string>("");
  const [qrValue, setQrValue] = useState<string>("");

  const qrImageSrc = useMemo(() => {
    if (!qrValue) return "";
    const isImageLike =
      qrValue.startsWith("http://") ||
      qrValue.startsWith("https://") ||
      qrValue.startsWith("data:image/");
    return isImageLike
      ? qrValue
      : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrValue)}`;
  }, [qrValue]);

  useEffect(() => {
    if (!selectedAddressId && addresses.length) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const selectedPromotion = useMemo(
    () =>
      activePromotions.find(
        (promotion: Promotion) => promotion.id === selectedPromotionId,
      ) || null,
    [activePromotions, selectedPromotionId],
  );

  const subtotal = totalAmount;
  const canUsePromotion = selectedPromotion
    ? subtotal >= Number(selectedPromotion.condition || 0)
    : false;
  const promotionDiscount = canUsePromotion
    ? Number(selectedPromotion?.discount || 0)
    : 0;
  const finalTotal = Math.max(0, subtotal - promotionDiscount);

  const clearPurchasedItems = useCallback(async () => {
    await Promise.allSettled(
      items.map((item) => cartItemService.remove(item.id)),
    );
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    queryClient.invalidateQueries({ queryKey: ["cart-items"] });
  }, [items, queryClient]);

  // Dùng ref để giữ reference ổn định, tránh effect restart mỗi khi items thay đổi
  const clearPurchasedItemsRef = useRef(clearPurchasedItems);
  useEffect(() => {
    clearPurchasedItemsRef.current = clearPurchasedItems;
  }, [clearPurchasedItems]);

  // Polling kiểm tra trạng thái order sau khi QR hiển thị
  useEffect(() => {
    if (!createdOrderId || !qrValue) return;

    const MAX_POLLS = 200; // ~10 phút
    let pollCount = 0;
    let stopped = false;

    const intervalId = window.setInterval(async () => {
      if (stopped) return;
      pollCount += 1;

      if (pollCount > MAX_POLLS) {
        stopped = true;
        window.clearInterval(intervalId);
        toast.error(
          "Hết thời gian chờ xác nhận. Vui lòng bấm nút xác nhận thủ công.",
        );
        return;
      }

      try {
        if (!customerId) return;
        const userOrders = await orderService.getByUserId(customerId);
        const order = userOrders.find(
          (o) => String(o?.id) === String(createdOrderId),
        );
        if (!order) return;

        if (isPaidStatus(order?.status)) {
          stopped = true;
          window.clearInterval(intervalId);
          await clearPurchasedItemsRef.current();
          navigate(
            `/checkout/success?orderId=${createdOrderId}&method=bank_transfer`,
            { replace: true },
          );
        }
      } catch {
        // tiếp tục polling
      }
    }, 3000);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdOrderId, qrValue]);

  const [isConfirming, setIsConfirming] = useState(false);

  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error("Giỏ hàng đang trống");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ nhận hàng");
      return;
    }

    if (selectedPromotion && !canUsePromotion) {
      toast.error("Đơn hàng chưa đạt điều kiện áp dụng khuyến mãi");
      return;
    }

    try {
      const order = await createOrderMutation.mutateAsync({
        customer_id: customerId,
        extra_fee: 0,
        address_id: selectedAddressId,
        promotion_id: selectedPromotionId || undefined,
        payment_method: paymentMethod,
      });

      if (paymentMethod === "cod") {
        await clearPurchasedItems();
        navigate(`/checkout/success?orderId=${order.id}&method=cod`, {
          replace: true,
        });
        return;
      }

      const payment = await createPaymentMutation.mutateAsync({
        orderId: order.id,
        promotionId: selectedPromotionId || undefined,
      });

      const qr = getPaymentQrValue(payment);
      const redirectUrl = getPaymentRedirectUrl(payment);

      setCreatedOrderId(order.id);

      if (qr) {
        setQrValue(qr);
        toast.success("Vui lòng quét QR để hoàn tất thanh toán");
        return;
      }

      if (redirectUrl) {
        window.open(redirectUrl, "_blank", "noopener,noreferrer");
        toast.info(
          "Đã mở trang thanh toán. Sau khi thanh toán xong hệ thống sẽ tự cập nhật.",
        );
        return;
      }

      toast.info("Đã tạo phiên thanh toán. Hệ thống đang chờ xác nhận.");
    } catch {
      // toast lỗi được xử lý trong hooks
    }
  };

  if (isCartLoading || isAddressLoading || isPromotionLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (!items.length) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <EmptyState
          title="Giỏ hàng trống"
          description="Bạn cần thêm sản phẩm trước khi thanh toán"
        >
          <Button asChild>
            <Link to="/products">Mua sắm ngay</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Chọn địa chỉ, khuyến mãi và phương thức thanh toán
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <MapPin className="h-5 w-5" /> Địa chỉ nhận hàng
            </h2>

            {!addresses.length ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Bạn chưa có địa chỉ nhận hàng.
                </p>
                <Button asChild>
                  <Link
                    to="/addresses"
                    state={{ fromCheckout: true, returnTo: "/checkout" }}
                  >
                    Thêm địa chỉ
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => {
                  const selected = selectedAddressId === address.id;
                  return (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium">{address.name_recipient}</p>
                        {selected && <Badge>Đang chọn</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.phone_recipient}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.street}, {address.ward}, {address.district},{" "}
                        {address.city}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <TicketPercent className="h-5 w-5" /> Khuyến mãi
            </h2>

            {isPromotionLoading && (
              <p className="text-xs text-muted-foreground">
                Đang tải khuyến mãi...
              </p>
            )}

            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={selectedPromotionId}
              onChange={(e) => setSelectedPromotionId(e.target.value)}
            >
              <option value="">Không áp dụng khuyến mãi</option>
              {activePromotions.map((promotion: Promotion) => (
                <option key={promotion.id} value={promotion.id}>
                  {promotion.name} - giảm{" "}
                  {Number(promotion.discount).toLocaleString("vi-VN")}đ (đk:{" "}
                  {Number(promotion.condition).toLocaleString("vi-VN")}đ)
                </option>
              ))}
            </select>

            {selectedPromotion && (
              <p className="mt-2 text-xs text-muted-foreground">
                {canUsePromotion
                  ? "Khuyến mãi hợp lệ cho đơn hàng này"
                  : "Đơn hàng chưa đạt điều kiện áp dụng"}
              </p>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="h-5 w-5" /> Phương thức thanh toán
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`rounded-lg border p-3 text-left transition ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/60"
                }`}
              >
                <p className="font-medium">Thanh toán COD</p>
                <p className="text-xs text-muted-foreground">
                  Trả tiền khi nhận hàng
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`rounded-lg border p-3 text-left transition ${
                  paymentMethod === "bank_transfer"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/60"
                }`}
              >
                <p className="font-medium">Chuyển khoản</p>
                <p className="text-xs text-muted-foreground">
                  Hiển thị QR để thanh toán
                </p>
              </button>
            </div>
          </Card>

          {paymentMethod === "bank_transfer" && qrValue && (
            <Card className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <QrCode className="h-5 w-5" /> Quét mã QR để thanh toán
              </h2>

              <div className="flex flex-col items-center gap-3">
                <img
                  src={qrImageSrc}
                  alt="QR thanh toán"
                  className="h-64 w-64 rounded-lg border object-contain p-2"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Quét mã QR bằng app ngân hàng để thanh toán.
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Sau khi chuyển khoản xong, bấm nút bên dưới để xác nhận.
                </p>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={isConfirming}
                  onClick={async () => {
                    setIsConfirming(true);
                    try {
                      await clearPurchasedItems();
                    } catch {
                      // bỏ qua lỗi xóa giỏ hàng
                    }
                    navigate(
                      `/checkout/success?orderId=${createdOrderId}&method=bank_transfer`,
                      { replace: true },
                    );
                  }}
                >
                  {isConfirming
                    ? "Đang xử lý..."
                    : "✅ Tôi đã chuyển khoản xong"}
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-4 p-5">
            <h3 className="mb-4 text-lg font-semibold">Tóm tắt thanh toán</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giảm giá</span>
                <span>-{promotionDiscount.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-base font-semibold">
                <span>Tổng thanh toán</span>
                <span>{finalTotal.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            <Button
              className="mt-4 w-full"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={
                createOrderMutation.isPending || createPaymentMutation.isPending
              }
            >
              {createOrderMutation.isPending || createPaymentMutation.isPending
                ? "Đang xử lý..."
                : "Xác nhận thanh toán"}
            </Button>

            <Button variant="outline" className="mt-2 w-full" asChild>
              <Link to="/cart">Quay lại giỏ hàng</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
