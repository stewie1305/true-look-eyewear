import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import { addressService } from "@/features/address/services";
import type {
  CreateAddressDto,
  UpdateAddressDto,
} from "@/features/address/types";

export function useAddresses() {
  const query = useQuery({
    queryKey: QUERY_KEYS.ADDRESSES,
    queryFn: () => addressService.getAll(),
  });

  const addresses = Array.isArray(query.data)
    ? query.data
    : (query.data?.data ?? []);

  return {
    addresses,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressDto) => addressService.create(data),
    onSuccess: () => {
      toast.success("Thêm địa chỉ thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESSES });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Thêm địa chỉ thất bại");
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAddressDto }) =>
      addressService.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật địa chỉ thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESSES });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật địa chỉ thất bại");
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressService.remove(id),
    onSuccess: () => {
      toast.success("Xóa địa chỉ thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESSES });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Xóa địa chỉ thất bại");
    },
  });
}
