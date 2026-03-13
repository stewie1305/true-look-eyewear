import { AlertCircle, ReceiptText } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams();

  const orderId =
    searchParams.get("orderId") ||
    searchParams.get("order_id") ||
    searchParams.get("orderCode") ||
    searchParams.get("order_code") ||
    "";

  return (
    <div className="container mx-auto max-w-xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            Thanh toán thất bại
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Giao dịch đã bị huỷ hoặc chưa hoàn tất. Bạn có thể thử thanh toán
            lại cho đơn hàng này.
          </p>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mã đơn hàng</span>
              <span className="font-medium">
                {orderId ? `#${orderId}` : "-"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button asChild>
              <Link to={orderId ? `/checkout?orderId=${orderId}` : "/checkout"}>
                Thanh toán lại
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link to="/orders">
                <ReceiptText className="mr-2 h-4 w-4" />
                Về đơn hàng
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
