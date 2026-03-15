


export interface CreatePaymentDto {
  orderId: string;
  promotionId?: string;
}

export interface PaymentCheckoutResponse {
  message?: string;
  checkoutUrl?: string;
  qrCode?: string;
  total?: number;
  discount?: number;
  finalAmount?: number;
}

export interface PaymentWebhookResponse {
  error: number;
  message: string;
}
