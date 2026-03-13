export type ShippingLocationType = "CITY" | "DISTRICT" | "WARD";

export interface ShippingLocation {
  id: string;
  name: string;
  parentId?: string;
  raw?: unknown;
}

export interface ShippingLocationParams {
  type: ShippingLocationType;
  parentId?: string | number;
}

export interface ShippingFeeParams {
  fromCityName: string;
  fromDistrictName: string;
  toCityName: string;
  toDistrictName: string;
  shippingWeight: number;
  money: number;
}

export interface ShippingFeeResult {
  fee: number;
  raw?: unknown;
}

export interface NhanhOrderProduct {
  id: string;
  name: string;
  code: string;
  quantity: number;
  price: number;
  weight: number;
}

export interface CreateNhanhOrderDto {
  id: string;
  carrierId: number;
  carrierName: string;
  serviceId: number;
  serviceName: string;
  depotId: number;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  customerCityName: string;
  customerDistrictName: string;
  moneyTransfer: number;
  productList: NhanhOrderProduct[];
}

export interface NhanhOrdersFilter {
  fromDate: string;
  toDate: string;
}

export interface NhanhOrder {
  id: string;
  orderId?: string;
  status?: string;
  carrierId?: number;
  carrierName?: string;
  serviceId?: number;
  serviceName?: string;
  customerName?: string;
  customerMobile?: string;
  customerAddress?: string;
  customerCityName?: string;
  customerDistrictName?: string;
  moneyTransfer?: number;
  createdAt?: string;
  updatedAt?: string;
  productList?: NhanhOrderProduct[];
  raw?: unknown;
}
