import { useEffect, useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { paymentService } from "../services";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const redirectParams = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  useQuery({
    queryKey: ["payments", "success-redirect", redirectParams],
    queryFn: () => paymentService.getSuccessRedirect(redirectParams),
    enabled: Object.keys(redirectParams).length > 0,
    retry: false,
  });

  useEffect(() => {
    try {
      localStorage.removeItem("pending_bank_order_id");
    } catch {
      // ignore localStorage errors
    }
  }, []);

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

          <Button className="w-full" asChild>
            <Link to="/products">Tiếp tục mua sắm</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
