import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const method = searchParams.get("method") || "cod";

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Card className="space-y-4 p-8 text-center">
        <div className="mx-auto w-fit rounded-full bg-green-500/10 p-3">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold">Thanh toán thành công</h1>
        <p className="text-sm text-muted-foreground">
          Đơn hàng của bạn đã được ghi nhận.
        </p>

        {orderId && (
          <p className="text-sm">
            Mã đơn hàng:{" "}
            <span className="font-mono font-semibold">{orderId}</span>
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Phương thức: {method === "bank_transfer" ? "Chuyển khoản" : "COD"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button asChild>
            <Link to="/orders">Xem đơn hàng của tôi</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/products">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
