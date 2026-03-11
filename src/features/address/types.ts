import type { BaseFilterParams } from "@/shared/types";

export interface Address {
  id: string;
  user_id?: string;
  name_recipient: string;
  phone_recipient: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  note?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressDto {
  name_recipient: string;
  phone_recipient: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  note?: string;
  role?: string;
}

export interface UpdateAddressDto {
  name_recipient?: string;
  phone_recipient?: string;
  city?: string;
  district?: string;
  ward?: string;
  street?: string;
  note?: string;
  role?: string;
}

export interface AddressFilterParams extends BaseFilterParams {
  search?: string;
}
