import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import { paymentService } from "../services";
import type {
  CreatePaymentDto,
  PaymentResponse,
  PaymentWebhookPayload,
} from "../types";

export const getPaymentRedirectUrl = (
  payload: PaymentResponse | null | undefined,
) => {
  if (!payload) return null;

  const direct =
    (payload.paymentUrl as string | undefined) ||
    (payload.checkoutUrl as string | undefined) ||
    (payload.url as string | undefined);

  if (direct) return direct;

  const nestedData = payload.data as
    | { paymentUrl?: string; checkoutUrl?: string; url?: string }
    | undefined;

  return (
    nestedData?.paymentUrl || nestedData?.checkoutUrl || nestedData?.url || null
  );
};

export const getPaymentQrValue = (
  payload: PaymentResponse | null | undefined,
) => {
  if (!payload) return null;

  const direct =
    (payload.qrCode as string | undefined) ||
    (payload.qrUrl as string | undefined) ||
    (payload.qr as string | undefined);

  if (direct) return direct;

  const nestedData = payload.data as
    | { qrCode?: string; qrUrl?: string; qr?: string }
    | undefined;

  return nestedData?.qrCode || nestedData?.qrUrl || nestedData?.qr || null;
};

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentDto) => paymentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Tạo thanh toán thất bại");
    },
  });
}

export function usePaymentWebhook() {
  return useMutation({
    mutationFn: (data: PaymentWebhookPayload) => paymentService.webhook(data),
    onSuccess: () => {
      toast.success("Xử lý webhook thanh toán thành công");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Xử lý webhook thất bại");
    },
  });
}
