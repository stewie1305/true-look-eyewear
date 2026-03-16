import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { paymentService } from "../services";

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams();
  const redirectParams = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  useQuery({
    queryKey: ["payments", "cancel-redirect", redirectParams],
    queryFn: () => paymentService.getCancelRedirect(redirectParams),
    enabled: Object.keys(redirectParams).length > 0,
    retry: false,
  });

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
            Giao dịch đã bị huỷ hoặc chưa hoàn tất.
          </p>

          <Button className="w-full" asChild>
            <Link to="/products">Tiếp tục mua sắm</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
