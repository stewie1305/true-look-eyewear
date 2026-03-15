import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { CreditCard, MapPin, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/shared/components/ui/button";
import {
  CardDescription,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { useAddresses } from "@/features/address/hooks/useAddresses";
import { useShippingFee } from "@/features/shipping/hooks/useShippingLocations";
import { useUserMe } from "@/features/users/hooks/useUsers";
import {
  useCreateOrder,
  useOrderDetail,
} from "@/features/orders/hooks/useOrders";
import { useCart } from "@/features/cart/hooks/useCart";
import { QUERY_KEYS } from "@/shared/constants";
import { promotionService } from "@/features/promotions/services";
import type { Promotion } from "@/features/promotions/types";
import { useCreatePayment } from "../hooks/usePayments";

type PaymentMethod = "bank_transfer" | "cod";

interface CheckoutResult {
  orderId: string;
  checkoutUrl?: string;
  qrCode?: string;
  finalAmount?: number;
  discount?: number;
}

const PENDING_BANK_ORDER_KEY = "pending_bank_order_id";
const CANCELED_BANK_ORDER_IDS_KEY = "canceled_bank_order_ids";
const SHIPPING_ORIGIN = {
  cityName: "Hồ Chí Minh",
  districtName: "Thành phố Thủ Đức",
};

export default function PaymentCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultOrderId = searchParams.get("orderId") || "";

  const checkoutState = location.state as {
    checkoutWithAddress?: { id?: string };
    selectedCartItemIds?: string[];
  } | null;

  const selectedCartItemIds = useMemo(
    () =>
      Array.isArray(checkoutState?.selectedCartItemIds)
        ? checkoutState.selectedCartItemIds
            .map((id) => String(id))
            .filter((id) => Boolean(id))
        : [],
    [checkoutState?.selectedCartItemIds],
  );

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [appliedPromotionId, setAppliedPromotionId] = useState<
    string | undefined
  >();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("bank_transfer");
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(
    null,
  );

  const payosCode = searchParams.get("code");
  const payosStatus = searchParams.get("status");
  const payosCancel = searchParams.get("cancel");

  const { items, totalAmount, isLoading: isLoadingCart } = useCart();
  const { data: currentUser } = useUserMe();
  const { addresses, isLoading: isLoadingAddresses } = useAddresses();
  const { data: selectedOrder } = useOrderDetail(defaultOrderId);
  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreatePayment();

  const checkoutItems = useMemo(() => {
    if (defaultOrderId) return [];
    if (!selectedCartItemIds.length) return items;
    return items.filter((item) =>
      selectedCartItemIds.includes(String(item.id)),
    );
  }, [defaultOrderId, items, selectedCartItemIds]);

  const checkoutItemsAmount = useMemo(
    () =>
      checkoutItems.reduce((sum, item) => {
        const price = Number(item.variant?.price || 0);
        return sum + price * Number(item.quantity || 0);
      }, 0),
    [checkoutItems],
  );

  const promotionsQuery = useQuery({
    queryKey: [...QUERY_KEYS.PROMOTIONS, "active-checkout"],
    queryFn: () => promotionService.getAllActive({ status: "active" }),
    placeholderData: (prev) => prev,
  });

  const promotions = useMemo<Promotion[]>(
    () => (Array.isArray(promotionsQuery.data) ? promotionsQuery.data : []),
    [promotionsQuery.data],
  );

  const selectedPromotion = useMemo(
    () => promotions.find((promotion) => promotion.id === appliedPromotionId),
    [appliedPromotionId, promotions],
  );

  const subtotal = useMemo(() => {
    if (defaultOrderId) {
      return Number(selectedOrder?.total || 0);
    }
    return Number(checkoutItemsAmount || totalAmount || 0);
  }, [checkoutItemsAmount, defaultOrderId, selectedOrder?.total, totalAmount]);

  const promotionRequirement = Number(selectedPromotion?.condition || 0);
  const isPromotionEligible =
    !!selectedPromotion && subtotal >= promotionRequirement;

  const estimatedDiscount = useMemo(() => {
    if (!selectedPromotion || !isPromotionEligible) return 0;
    const discount = Number(selectedPromotion.discount || 0);
    return Math.min(discount, subtotal);
  }, [isPromotionEligible, selectedPromotion, subtotal]);

  const estimatedFinalAmount = Math.max(subtotal - estimatedDiscount, 0);

  const estimatedShippingWeight = useMemo(() => {
    if (!checkoutItems.length) return 500;

    const totalQuantity = checkoutItems.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );

    return Math.max(500, totalQuantity * 250);
  }, [checkoutItems]);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId),
    [addresses, selectedAddressId],
  );

  const shippingFeeParams = useMemo(() => {
    if (defaultOrderId || !selectedAddress) return undefined;

    return {
      fromCityName: SHIPPING_ORIGIN.cityName,
      fromDistrictName: SHIPPING_ORIGIN.districtName,
      toCityName: selectedAddress.city,
      toDistrictName: selectedAddress.district,
      shippingWeight: estimatedShippingWeight,
      money: Math.max(0, subtotal),
    };
  }, [defaultOrderId, estimatedShippingWeight, selectedAddress, subtotal]);

  const shippingFeeQuery = useShippingFee(shippingFeeParams);

  const shippingFee = defaultOrderId
    ? Number(selectedOrder?.extra_fee || 0)
    : Number(shippingFeeQuery.data?.fee || 0);

  const totalPayable = Math.max(estimatedFinalAmount + shippingFee, 0);

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    const addressId = checkoutState?.checkoutWithAddress?.id;
    if (addressId && addresses.some((address) => address.id === addressId)) {
      setSelectedAddressId(addressId);
    }
  }, [addresses, checkoutState]);

  useEffect(() => {
    const pendingOrderId = localStorage.getItem(PENDING_BANK_ORDER_KEY);
    if (!pendingOrderId) return;

    const normalizedStatus = String(payosStatus || "").toLowerCase();
    const isPaidByCode = payosCode === "00";
    const isPaidByStatus = ["paid", "success", "succeeded"].includes(
      normalizedStatus,
    );
    const isCancel = String(payosCancel || "").toLowerCase() === "true";
    const isFailedStatus = ["cancelled", "canceled", "failed"].includes(
      normalizedStatus,
    );

    if (isCancel || isFailedStatus) {
      toast.error("Thanh toán đã bị huỷ");

      try {
        const raw = localStorage.getItem(CANCELED_BANK_ORDER_IDS_KEY);
        const parsed = raw ? (JSON.parse(raw) as unknown) : [];
        const ids = Array.isArray(parsed)
          ? parsed.map((item) => String(item))
          : ([] as string[]);

        if (!ids.includes(pendingOrderId)) {
          ids.push(pendingOrderId);
          localStorage.setItem(
            CANCELED_BANK_ORDER_IDS_KEY,
            JSON.stringify(ids),
          );
        }
      } catch {
        // ignore localStorage parse errors
      }

      localStorage.removeItem(PENDING_BANK_ORDER_KEY);
      navigate(`/payment-failed?orderId=${pendingOrderId}`, {
        replace: true,
      });
      return;
    }

    if (isPaidByCode || isPaidByStatus) {
      navigate(
        `/payment-success?orderId=${pendingOrderId}&method=bank_transfer`,
        {
          replace: true,
        },
      );
    }
  }, [navigate, payosCancel, payosCode, payosStatus]);

  const getQrImageSrc = (qrCode: string) => {
    const value = qrCode.trim();

    if (value.startsWith("data:image")) return value;
    if (value.startsWith("http://") || value.startsWith("https://"))
      return value;

    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(value)}`;
  };

  const handlePlaceOrder = async () => {
    if (!defaultOrderId && !checkoutItems.length) {
      toast.error("Giỏ hàng đang trống");
      return;
    }

    if (!selectedAddress && !defaultOrderId) {
      toast.error("Vui lòng chọn địa chỉ nhận hàng");
      return;
    }

    if (!currentUser?.id && !defaultOrderId) {
      toast.error("Không lấy được thông tin người dùng");
      return;
    }

    if (!defaultOrderId && shippingFeeQuery.isError) {
      toast.error("Không tính được phí ship. Vui lòng kiểm tra lại địa chỉ.");
      return;
    }

    try {
      const orderId = defaultOrderId
        ? defaultOrderId
        : (
            await createOrderMutation.mutateAsync({
              customer_id: String(currentUser?.id),
              extra_fee: shippingFee,
              cart_item_ids: selectedCartItemIds.length
                ? selectedCartItemIds
                : undefined,
            })
          )?.id;

      if (!orderId) {
        toast.error("Không thể tạo đơn hàng");
        return;
      }

      if (paymentMethod === "cod") {
        toast.success("Đặt hàng COD thành công");
        navigate(`/payment-success?orderId=${orderId}&method=cod`);
        return;
      }

      const payment = await createPaymentMutation.mutateAsync({
        orderId,
        promotionId: appliedPromotionId,
      });

      if (!payment) {
        toast.error("Không tạo được thanh toán");
        return;
      }

      if (!payment.checkoutUrl && !payment.qrCode) {
        navigate(`/payment-success?orderId=${orderId}&method=bank_transfer`);
        return;
      }

      if (payment.checkoutUrl) {
        localStorage.setItem(PENDING_BANK_ORDER_KEY, orderId);
        window.location.href = payment.checkoutUrl;
        return;
      }

      setCheckoutResult({
        orderId,
        checkoutUrl: payment.checkoutUrl,
        qrCode: payment.qrCode,
        finalAmount: payment.finalAmount,
        discount: payment.discount,
      });

      toast.success("Đã tạo mã thanh toán. Vui lòng quét QR để thanh toán.");
    } catch {
      // lỗi đã được xử lý trong mutation hooks
    }
  };

  const isSubmitting =
    createOrderMutation.isPending || createPaymentMutation.isPending;

  if (checkoutResult) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Quét mã QR để thanh toán
            </CardTitle>
            <CardDescription>
              Đơn hàng #{checkoutResult.orderId} đã được tạo. Hoàn tất chuyển
              khoản để xác nhận.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {checkoutResult.qrCode ? (
              <div className="mx-auto w-fit rounded-lg border bg-card p-3">
                <img
                  src={getQrImageSrc(checkoutResult.qrCode)}
                  alt="QR thanh toán"
                  className="h-64 w-64 object-contain"
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Không nhận được dữ liệu QR từ cổng thanh toán.
              </p>
            )}

            {typeof checkoutResult.finalAmount === "number" && (
              <div className="rounded-lg border p-3 text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Số tiền cần thanh toán
                  </span>
                  <span className="font-semibold">
                    {Number(checkoutResult.finalAmount).toLocaleString("vi-VN")}
                    đ
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span className="font-medium text-primary">
                    -
                    {Number(checkoutResult.discount || 0).toLocaleString(
                      "vi-VN",
                    )}
                    đ
                  </span>
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {checkoutResult.checkoutUrl && (
                <Button variant="outline" asChild>
                  <a
                    href={checkoutResult.checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Mở cổng thanh toán
                  </a>
                </Button>
              )}

              <Button
                onClick={() =>
                  navigate(
                    `/payment-success?orderId=${checkoutResult.orderId}&method=bank_transfer`,
                  )
                }
              >
                Tôi đã thanh toán
              </Button>
            </div>

            <Button variant="ghost" asChild className="w-full">
              <Link to="/orders">Quay lại đơn hàng của tôi</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/orders">← Quay lại đơn hàng</Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Chọn địa chỉ nhận hàng
              </CardTitle>
              <CardDescription>
                Vui lòng chọn một địa chỉ để giao đơn hàng.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingAddresses ? (
                <p className="text-sm text-muted-foreground">
                  Đang tải địa chỉ...
                </p>
              ) : addresses.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm">
                  Chưa có địa chỉ. Vui lòng thêm địa chỉ trước khi thanh toán.
                  <div className="mt-3">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/addresses">Thêm địa chỉ</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                addresses.map((address) => {
                  const isSelected = selectedAddressId === address.id;

                  return (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <p className="font-medium">
                        {address.name_recipient} - {address.phone_recipient}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.street}, {address.ward}, {address.district},{" "}
                        {address.city}
                      </p>
                    </button>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Áp mã giảm giá
              </CardTitle>
              <CardDescription>
                Chọn khuyến mãi theo tên. Hệ thống sẽ tự gửi ID ngầm.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {promotions.length > 0 ? (
                <div className="rounded-xl border p-3">
                  <p className="mb-3 text-sm font-medium">
                    Khuyến mãi đang hoạt động
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedPromotionId(undefined);
                        toast.info("Đã bỏ khuyến mãi");
                      }}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                        !appliedPromotionId
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      Không áp dụng khuyến mãi
                    </button>

                    {promotions.map((promotion) => (
                      <button
                        key={promotion.id}
                        type="button"
                        onClick={() => {
                          setAppliedPromotionId(promotion.id);
                          toast.success(`Đã chọn: ${promotion.name}`);
                        }}
                        className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                          appliedPromotionId === promotion.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <p>{promotion.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Giảm{" "}
                          {Number(promotion.discount || 0).toLocaleString(
                            "vi-VN",
                          )}
                          đ
                          {Number(promotion.condition || 0) > 0
                            ? ` • Đơn từ ${Number(promotion.condition).toLocaleString("vi-VN")}đ`
                            : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                  Hiện chưa có khuyến mãi khả dụng.
                </div>
              )}

              {selectedPromotion && (
                <div className="space-y-2">
                  <Badge variant="secondary">
                    Đang áp dụng: {selectedPromotion.name}
                  </Badge>
                  {!isPromotionEligible && (
                    <p className="text-xs text-destructive">
                      Đơn hàng chưa đạt mức tối thiểu{" "}
                      {promotionRequirement.toLocaleString("vi-VN")}đ, hiện tại
                      là {subtotal.toLocaleString("vi-VN")}đ.
                    </p>
                  )}
                  {isPromotionEligible && (
                    <p className="text-xs text-primary">
                      Ước tính giảm {estimatedDiscount.toLocaleString("vi-VN")}đ
                      cho đơn này.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`rounded-lg border p-3 text-left transition ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <p className="font-medium">COD</p>
                <p className="text-sm text-muted-foreground">
                  Thanh toán khi nhận hàng
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`rounded-lg border p-3 text-left transition ${
                  paymentMethod === "bank_transfer"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <p className="font-medium">Chuyển khoản</p>
                <p className="text-sm text-muted-foreground">
                  Tạo mã QR để quét thanh toán
                </p>
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Tổng thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {defaultOrderId ? (
                <div className="rounded-lg border p-3 text-sm">
                  Đang thanh toán cho đơn hàng có sẵn: #{defaultOrderId}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Số sản phẩm</span>
                    <span>{checkoutItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{checkoutItemsAmount.toLocaleString("vi-VN")}đ</span>
                  </div>
                </>
              )}

              <div className="rounded-lg border p-3 text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Giá gốc</span>
                  <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span
                    className={
                      estimatedDiscount > 0 ? "text-primary font-medium" : ""
                    }
                  >
                    -{estimatedDiscount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span
                    className={
                      shippingFeeQuery.isLoading || shippingFeeQuery.isError
                        ? "text-muted-foreground"
                        : ""
                    }
                  >
                    {defaultOrderId
                      ? `${shippingFee.toLocaleString("vi-VN")}đ`
                      : shippingFeeQuery.isLoading
                        ? "Đang tính..."
                        : shippingFeeQuery.isError
                          ? "Không tính được"
                          : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="font-semibold">Tổng thanh toán</span>
                  <span className="font-semibold text-primary">
                    {totalPayable.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {!defaultOrderId &&
                shippingFeeQuery.isError &&
                selectedAddress && (
                  <p className="text-xs text-destructive">
                    Chưa tính được phí ship tự động cho địa chỉ này.
                  </p>
                )}

              <div className="border-t pt-3 text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phương thức</span>
                  <span className="font-medium">
                    {paymentMethod === "cod" ? "COD" : "Chuyển khoản"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Khuyến mãi</span>
                  <span className="font-medium">
                    {selectedPromotion?.name || "Không"}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || isLoadingCart}
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </Button>

              <p className="text-xs text-muted-foreground">
                {paymentMethod === "cod"
                  ? "Bạn sẽ thanh toán khi nhận hàng."
                  : "Sau khi xác nhận, hệ thống sẽ tạo mã QR để bạn quét thanh toán."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
