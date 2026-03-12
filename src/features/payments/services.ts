import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  CreatePaymentDto,
  PaymentResponse,
  PaymentWebhookPayload,
} from "./types";

export const paymentService = {
  create: async (data: CreatePaymentDto): Promise<PaymentResponse> => {
    const payload = data.promotionId
      ? { orderId: data.orderId, promotionId: data.promotionId }
      : { orderId: data.orderId };

    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.BASE, payload);
    return response as unknown as PaymentResponse;
  },

  webhook: async (data: PaymentWebhookPayload): Promise<unknown> => {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.WEBHOOK, data);
    return response as unknown;
  },
};
