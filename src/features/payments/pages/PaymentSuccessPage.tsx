import { useEffect } from "react";
import { CheckCircle2, ReceiptText } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();

  const orderId =
    searchParams.get("orderId") ||
    searchParams.get("order_id") ||
    searchParams.get("orderCode") ||
    searchParams.get("order_code") ||
    searchParams.get("id") ||
    "";
  const method = searchParams.get("method") || "bank_transfer";
  const PAID_ORDERS_STORAGE_KEY = "paid_order_ids";
  const PENDING_BANK_ORDER_KEY = "pending_bank_order_id";
  const CANCELED_BANK_ORDER_IDS_KEY = "canceled_bank_order_ids";

  const resolvedOrderId =
    orderId || localStorage.getItem(PENDING_BANK_ORDER_KEY) || "";

  useEffect(() => {
    if (!resolvedOrderId) return;

    try {
      const raw = localStorage.getItem(PAID_ORDERS_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      const ids = Array.isArray(parsed)
        ? parsed.map((id) => String(id))
        : ([] as string[]);

      if (!ids.includes(resolvedOrderId)) {
        ids.push(resolvedOrderId);
        localStorage.setItem(PAID_ORDERS_STORAGE_KEY, JSON.stringify(ids));
      }

      const rawCanceled = localStorage.getItem(CANCELED_BANK_ORDER_IDS_KEY);
      const parsedCanceled = rawCanceled
        ? (JSON.parse(rawCanceled) as unknown)
        : [];
      const canceledIds = Array.isArray(parsedCanceled)
        ? parsedCanceled
            .map((item) => String(item))
            .filter((item) => item !== resolvedOrderId)
        : ([] as string[]);
      localStorage.setItem(
        CANCELED_BANK_ORDER_IDS_KEY,
        JSON.stringify(canceledIds),
      );

      localStorage.removeItem(PENDING_BANK_ORDER_KEY);
    } catch {
      // ignore localStorage parse errors
    }
  }, [resolvedOrderId]);

  const methodLabel = method === "cod" ? "COD" : "Chuyển khoản";

  return (
    <div className="container mx-auto max-w-xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-6 w-6" />
            Thanh toán thành công
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận.
          </p>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mã đơn hàng</span>
              <span className="font-medium">
                {resolvedOrderId ? `#${resolvedOrderId}` : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Phương thức</span>
              <span className="font-medium">{methodLabel}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button asChild>
              <Link to="/orders">
                <ReceiptText className="mr-2 h-4 w-4" />
                Xem đơn hàng
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/products">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
