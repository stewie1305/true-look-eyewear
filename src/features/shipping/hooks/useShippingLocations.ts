import { useQuery } from "@tanstack/react-query";

import { shippingService } from "@/features/shipping/services";
import { QUERY_KEYS } from "@/shared/constants";
import type { ShippingFeeParams } from "@/features/shipping/types";

export function useCities() {
  return useQuery({
    queryKey: QUERY_KEYS.SHIPPING.CITIES,
    queryFn: () => shippingService.getCities(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDistricts(cityId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SHIPPING.DISTRICTS(cityId || ""),
    queryFn: () => shippingService.getDistricts(cityId as string),
    enabled: !!cityId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useWards(districtId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SHIPPING.WARDS(districtId || ""),
    queryFn: () => shippingService.getWards(districtId as string),
    enabled: !!districtId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useShippingFee(params?: ShippingFeeParams) {
  return useQuery({
    queryKey: QUERY_KEYS.SHIPPING.FEE(
      params?.toCityName || "",
      params?.toDistrictName || "",
      Number(params?.money || 0),
      Number(params?.shippingWeight || 0),
    ),
    queryFn: () => shippingService.getNhanhFee(params as ShippingFeeParams),
    enabled:
      !!params?.fromCityName &&
      !!params?.fromDistrictName &&
      !!params?.toCityName &&
      !!params?.toDistrictName,
    staleTime: 60 * 1000,
    retry: 1,
  });
}
