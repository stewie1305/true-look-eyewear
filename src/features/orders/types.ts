import type { BaseFilterParams } from "@/shared/types";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Paid"
  | "Completed"
  | "Cancelled"
  | string;

export interface OrderCustomer {
  id: string;
  username?: string;
  fullName?: string;
  email?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  total: number;
  extra_fee: number;
  status?: OrderStatus;
  update_at?: string;
  create_at?: string;
  customer?: OrderCustomer;
}

export interface CreateOrderDto {
  customer_id?: string;
  extra_fee: number;
  address_id?: string;
  promotion_id?: string;
  payment_method?: "cod" | "bank_transfer" | string;
}

export interface UpdateOrderDto {
  customer_id?: string;
  extra_fee?: number;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface OrderFilterParams extends BaseFilterParams {
  customer_id?: string;
  status?: string;
}
