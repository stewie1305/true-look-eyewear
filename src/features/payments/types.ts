export interface CreatePaymentDto {
  orderId: string;
  promotionId?: string;
}

export interface PaymentResponse {
  id?: string;
  orderId?: string;
  status?: string;
  paymentUrl?: string;
  checkoutUrl?: string;
  url?: string;
  [key: string]: unknown;
}

export interface PaymentWebhookPayload {
  [key: string]: unknown;
}
