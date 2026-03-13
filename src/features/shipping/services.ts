import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  CreateNhanhOrderDto,
  NhanhOrder,
  NhanhOrdersFilter,
  ShippingFeeParams,
  ShippingFeeResult,
  ShippingLocation,
  ShippingLocationParams,
  ShippingLocationType,
} from "./types";

const getValue = (item: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = item[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return undefined;
};

const getNumericValue = (payload: unknown, keys: string[]): number | null => {
  if (!payload || typeof payload !== "object") return null;

  const source = payload as Record<string, unknown>;
  for (const key of keys) {
    const value = source[key];
    if (value === undefined || value === null || value === "") continue;

    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
};

const getMaxFeeFromList = (payload: unknown): number | null => {
  if (!Array.isArray(payload) || payload.length === 0) return null;

  const fees = payload
    .map((item) =>
      getNumericValue(item, [
        "shipFee",
        "ship_fee",
        "shippingFee",
        "shipping_fee",
        "fee",
        "money",
        "amount",
        "price",
      ]),
    )
    .filter((value): value is number => Number.isFinite(value));

  if (!fees.length) return null;
  return Math.max(...fees);
};

const toOrderList = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const source = payload as Record<string, unknown>;

  if (Array.isArray(source.data)) {
    return source.data;
  }

  const nestedData = source.data;
  if (nestedData && typeof nestedData === "object") {
    const nestedObject = nestedData as Record<string, unknown>;
    if (Array.isArray(nestedObject.orders)) {
      return nestedObject.orders;
    }
    if (nestedObject.orders && typeof nestedObject.orders === "object") {
      return Object.values(nestedObject.orders as Record<string, unknown>);
    }
  }

  if (Array.isArray(source.orders)) {
    return source.orders;
  }

  if (source.orders && typeof source.orders === "object") {
    return Object.values(source.orders as Record<string, unknown>);
  }

  return [];
};

const normalizeNhanhOrders = (payload: unknown): NhanhOrder[] => {
  const list = toOrderList(payload);

  return list.map((entry, index) => {
    const item = entry as Record<string, unknown>;
    const rawId = getValue(item, ["id", "orderId", "order_id", "code"]);
    const productList = Array.isArray(item.productList)
      ? item.productList
      : Array.isArray(item.products)
        ? item.products
        : undefined;

    return {
      id: String(rawId ?? `nhanh-${index}`),
      orderId: rawId ? String(rawId) : undefined,
      status: String(
        getValue(item, [
          "status",
          "state",
          "orderStatus",
          "statusCode",
          "statusName",
        ]) ?? "",
      ),
      carrierId: Number(getValue(item, ["carrierId", "carrier_id"]) ?? 0),
      carrierName: String(
        getValue(item, ["carrierName", "carrier_name"]) ?? "",
      ),
      serviceId: Number(getValue(item, ["serviceId", "service_id"]) ?? 0),
      serviceName: String(
        getValue(item, ["serviceName", "service_name"]) ?? "",
      ),
      customerName: String(
        getValue(item, ["customerName", "customer_name"]) ?? "",
      ),
      customerMobile: String(
        getValue(item, ["customerMobile", "customer_mobile"]) ?? "",
      ),
      customerAddress: String(
        getValue(item, ["customerAddress", "customer_address"]) ?? "",
      ),
      customerCityName: String(
        getValue(item, [
          "customerCityName",
          "customer_city_name",
          "customerCity",
          "customer_city",
        ]) ?? "",
      ),
      customerDistrictName: String(
        getValue(item, [
          "customerDistrictName",
          "customer_district_name",
          "customerDistrict",
          "customer_district",
        ]) ?? "",
      ),
      moneyTransfer: Number(
        getValue(item, [
          "moneyTransfer",
          "money_transfer",
          "calcTotalMoney",
          "totalMoney",
          "total",
        ]) ?? 0,
      ),
      createdAt: String(
        getValue(item, ["createdAt", "created_at", "createdDateTime"]) ?? "",
      ),
      updatedAt: String(getValue(item, ["updatedAt", "updated_at"]) ?? ""),
      productList: Array.isArray(productList)
        ? productList.map((product) => {
            const source = product as Record<string, unknown>;
            return {
              id: String(
                getValue(source, ["id", "productId", "product_id"]) ?? "",
              ),
              name: String(
                getValue(source, ["name", "productName", "product_name"]) ?? "",
              ),
              code: String(getValue(source, ["code", "sku"]) ?? ""),
              quantity: Number(getValue(source, ["quantity", "qty"]) ?? 0),
              price: Number(getValue(source, ["price", "amount"]) ?? 0),
              weight: Number(getValue(source, ["weight"]) ?? 0),
            };
          })
        : undefined,
      raw: entry,
    } satisfies NhanhOrder;
  });
};

const normalizeLocations = (payload: unknown): ShippingLocation[] => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown })?.data)
      ? ((payload as { data: unknown[] }).data ?? [])
      : [];

  const normalized: ShippingLocation[] = [];

  for (const entry of list) {
    const item = entry as Record<string, unknown>;
    const rawId = getValue(item, [
      "id",
      "locationId",
      "location_id",
      "code",
      "value",
    ]);
    const rawName = getValue(item, ["name", "locationName", "label", "text"]);
    const rawParentId = getValue(item, [
      "parentId",
      "parent_id",
      "cityId",
      "districtId",
    ]);

    if (!rawId || !rawName) continue;

    normalized.push({
      id: String(rawId),
      name: String(rawName),
      parentId: rawParentId !== undefined ? String(rawParentId) : undefined,
      raw: entry,
    });
  }

  return normalized;
};

export const shippingService = {
  async getLocations({ type, parentId }: ShippingLocationParams) {
    const response = await apiClient.get<unknown>(
      API_ENDPOINTS.SHIPPING.LOCATIONS,
      {
        params: {
          type,
          ...(parentId !== undefined && parentId !== null && parentId !== ""
            ? {
                parentId: Number.isNaN(Number(parentId))
                  ? parentId
                  : Number(parentId),
              }
            : {}),
        },
      },
    );

    return normalizeLocations(response);
  },

  getCities() {
    return this.getLocations({ type: "CITY" });
  },

  getDistricts(parentId: string | number) {
    return this.getLocations({ type: "DISTRICT", parentId });
  },

  getWards(parentId: string | number) {
    return this.getLocations({ type: "WARD", parentId });
  },

  async getNhanhFee(params: ShippingFeeParams): Promise<ShippingFeeResult> {
    const response = await apiClient.post<unknown>(
      API_ENDPOINTS.SHIPPING.NHANH_FEE,
      params,
    );

    const responsePayload =
      (response as unknown as { data?: unknown })?.data ?? response;

    const feeFromRootList = getMaxFeeFromList(responsePayload);

    const apiCode = Array.isArray(responsePayload)
      ? null
      : getNumericValue(responsePayload, ["code", "statusCode"]);
    const apiMessage =
      responsePayload && typeof responsePayload === "object"
        ? getValue(responsePayload as Record<string, unknown>, [
            "message",
            "error",
          ])
        : undefined;

    if (apiCode === 0) {
      throw new Error(String(apiMessage || "Không tính được phí vận chuyển"));
    }

    const feeFromDataList =
      responsePayload && typeof responsePayload === "object"
        ? getMaxFeeFromList((responsePayload as Record<string, unknown>).data)
        : null;

    const feeFromRoot = getNumericValue(responsePayload, [
      "fee",
      "shipFee",
      "ship_fee",
      "shippingFee",
      "shipping_fee",
      "totalFee",
      "total_fee",
      "money",
      "amount",
      "price",
    ]);

    const nestedData =
      responsePayload && typeof responsePayload === "object"
        ? (responsePayload as Record<string, unknown>).data
        : undefined;

    const feeFromNested = getNumericValue(nestedData, [
      "fee",
      "shipFee",
      "ship_fee",
      "shippingFee",
      "shipping_fee",
      "totalFee",
      "total_fee",
      "money",
      "amount",
      "price",
    ]);

    const resolvedFee =
      feeFromRootList ?? feeFromDataList ?? feeFromRoot ?? feeFromNested;

    if (!Number.isFinite(resolvedFee ?? NaN)) {
      throw new Error(String(apiMessage || "Không tìm thấy phí vận chuyển"));
    }

    const fee = Math.max(0, Number(resolvedFee));

    return {
      fee,
      raw: responsePayload,
    };
  },

  async createNhanhOrder(data: CreateNhanhOrderDto) {
    return apiClient.post(API_ENDPOINTS.SHIPPING.NHANH_CREATE_ORDER, data);
  },

  async getNhanhOrders(filters: NhanhOrdersFilter): Promise<NhanhOrder[]> {
    const response = await apiClient.post(
      API_ENDPOINTS.SHIPPING.NHANH_ORDERS,
      filters,
    );
    return normalizeNhanhOrders(response);
  },
};

export type { ShippingLocationType };
