import { useEffect, useMemo, useState } from "react";
import {
  useCities,
  useDistricts,
  useWards,
} from "@/features/shipping/hooks/useShippingLocations";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Address, CreateAddressDto, UpdateAddressDto } from "../types";

type AddressFormState = {
  name_recipient: string;
  phone_recipient: string;
  cityId: string;
  city: string;
  districtId: string;
  district: string;
  wardId: string;
  ward: string;
  street: string;
  note: string;
  role: string;
};

const EMPTY_FORM: AddressFormState = {
  name_recipient: "",
  phone_recipient: "",
  cityId: "",
  city: "",
  districtId: "",
  district: "",
  wardId: "",
  ward: "",
  street: "",
  note: "",
  role: "",
};

interface AddressFormProps {
  defaultValues?: Partial<Address>;
  onSubmit: (data: CreateAddressDto | UpdateAddressDto) => void;
  onCancel?: () => void;
  isPending?: boolean;
  submitLabel?: string;
  isEdit?: boolean;
}

export function AddressForm({
  defaultValues,
  onSubmit,
  onCancel,
  isPending = false,
  submitLabel = "Lưu địa chỉ",
  isEdit = false,
}: AddressFormProps) {
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [districtKeyword, setDistrictKeyword] = useState("");
  const [wardKeyword, setWardKeyword] = useState("");
  const { data: cities = [], isLoading: isLoadingCities } = useCities();
  const { data: districts = [], isLoading: isLoadingDistricts } = useDistricts(
    form.cityId,
  );
  const { data: wards = [], isLoading: isLoadingWards } = useWards(
    form.districtId,
  );

  const normalizeText = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredDistricts = useMemo(() => {
    if (!districtKeyword.trim()) return districts;
    const keyword = normalizeText(districtKeyword.trim());
    return districts.filter((item) =>
      normalizeText(item.name).includes(keyword),
    );
  }, [districtKeyword, districts]);

  const filteredWards = useMemo(() => {
    if (!wardKeyword.trim()) return wards;
    const keyword = normalizeText(wardKeyword.trim());
    return wards.filter((item) => normalizeText(item.name).includes(keyword));
  }, [wardKeyword, wards]);

  useEffect(() => {
    setForm({
      name_recipient: defaultValues?.name_recipient || "",
      phone_recipient: defaultValues?.phone_recipient || "",
      cityId: "",
      city: defaultValues?.city || "",
      districtId: "",
      district: defaultValues?.district || "",
      wardId: "",
      ward: defaultValues?.ward || "",
      street: defaultValues?.street || "",
      note: defaultValues?.note || "",
      role: defaultValues?.role || "",
    });
  }, [defaultValues]);

  useEffect(() => {
    if (form.cityId || !form.city || !cities.length) return;
    const matchedCity = cities.find(
      (item) => item.name.toLowerCase() === form.city.toLowerCase(),
    );
    if (!matchedCity) return;
    setForm((prev) => ({ ...prev, cityId: matchedCity.id }));
  }, [cities, form.city, form.cityId]);

  useEffect(() => {
    if (form.districtId || !form.district || !districts.length) return;
    const matchedDistrict = districts.find(
      (item) => item.name.toLowerCase() === form.district.toLowerCase(),
    );
    if (!matchedDistrict) return;
    setForm((prev) => ({ ...prev, districtId: matchedDistrict.id }));
  }, [districts, form.district, form.districtId]);

  useEffect(() => {
    if (form.wardId || !form.ward || !wards.length) return;
    const matchedWard = wards.find(
      (item) => item.name.toLowerCase() === form.ward.toLowerCase(),
    );
    if (!matchedWard) return;
    setForm((prev) => ({ ...prev, wardId: matchedWard.id }));
  }, [wards, form.ward, form.wardId]);

  const handleCityChange = (cityId: string) => {
    const selected = cities.find((item) => item.id === cityId);
    setDistrictKeyword("");
    setWardKeyword("");
    setForm((prev) => ({
      ...prev,
      cityId,
      city: selected?.name || "",
      districtId: "",
      district: "",
      wardId: "",
      ward: "",
    }));
  };

  const handleDistrictChange = (districtId: string) => {
    const selected = districts.find((item) => item.id === districtId);
    setDistrictKeyword("");
    setWardKeyword("");
    setForm((prev) => ({
      ...prev,
      districtId,
      district: selected?.name || "",
      wardId: "",
      ward: "",
    }));
  };

  const handleWardChange = (wardId: string) => {
    const selected = wards.find((item) => item.id === wardId);
    setWardKeyword("");
    setForm((prev) => ({
      ...prev,
      wardId,
      ward: selected?.name || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name_recipient.trim())
      return setError("Vui lòng nhập tên người nhận");
    if (!form.phone_recipient.trim())
      return setError("Vui lòng nhập số điện thoại");
    if (!form.city.trim()) return setError("Vui lòng nhập tỉnh/thành phố");
    if (!form.district.trim()) return setError("Vui lòng nhập quận/huyện");
    if (!form.ward.trim()) return setError("Vui lòng nhập phường/xã");
    if (!form.street.trim()) return setError("Vui lòng nhập số nhà, tên đường");

    const payload: CreateAddressDto = {
      name_recipient: form.name_recipient.trim(),
      phone_recipient: form.phone_recipient.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      ward: form.ward.trim(),
      street: form.street.trim(),
      note: form.note.trim(),
      role: form.role.trim() || "Nhà riêng",
    };

    if (isEdit) {
      onSubmit(payload as UpdateAddressDto);
      return;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name_recipient">Tên người nhận</Label>
          <Input
            id="name_recipient"
            value={form.name_recipient}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name_recipient: e.target.value }))
            }
            placeholder="Tân Huỳnh"
            className="bg-background/70"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_recipient">Số điện thoại</Label>
          <Input
            id="phone_recipient"
            value={form.phone_recipient}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone_recipient: e.target.value }))
            }
            placeholder="0901234567"
            className="bg-background/70"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
        <div className="mb-3">
          <p className="text-sm font-medium">Khu vực giao hàng</p>
          <p className="text-xs text-muted-foreground">
            Chọn theo thứ tự Tỉnh/Thành → Quận/Huyện → Phường/Xã
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">Tỉnh/Thành phố</Label>
            <Select
              value={form.cityId || undefined}
              onValueChange={handleCityChange}
            >
              <SelectTrigger id="city" className="w-full bg-background/80">
                <SelectValue
                  placeholder={
                    isLoadingCities
                      ? "Đang tải tỉnh/thành..."
                      : "Chọn tỉnh/thành"
                  }
                />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                className="h-64 max-h-[65vh] w-(--radix-select-trigger-width) overflow-hidden"
              >
                {cities.length === 0 ? (
                  <SelectItem value="__empty_city" disabled>
                    Không có dữ liệu
                  </SelectItem>
                ) : (
                  cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">Quận/Huyện</Label>
            <Select
              value={form.districtId || undefined}
              onValueChange={handleDistrictChange}
              disabled={!form.cityId || isLoadingDistricts}
            >
              <SelectTrigger
                id="district"
                className="w-full bg-background/80 disabled:opacity-60"
              >
                <SelectValue
                  placeholder={
                    !form.cityId
                      ? "Chọn tỉnh/thành trước"
                      : isLoadingDistricts
                        ? "Đang tải quận/huyện..."
                        : "Chọn quận/huyện"
                  }
                />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                className="h-64 max-h-[65vh] w-(--radix-select-trigger-width) overflow-hidden"
              >
                <div className="sticky top-0 z-10 border-b bg-popover p-2">
                  <Input
                    value={districtKeyword}
                    onChange={(e) => setDistrictKeyword(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder="Tìm quận/huyện..."
                    className="h-8 bg-background"
                  />
                </div>
                {districts.length === 0 ? (
                  <SelectItem value="__empty_district" disabled>
                    Không có dữ liệu
                  </SelectItem>
                ) : filteredDistricts.length === 0 ? (
                  <SelectItem value="__not_found_district" disabled>
                    Không tìm thấy kết quả
                  </SelectItem>
                ) : (
                  filteredDistricts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ward">Phường/Xã</Label>
            <Select
              value={form.wardId || undefined}
              onValueChange={handleWardChange}
              disabled={!form.districtId || isLoadingWards}
            >
              <SelectTrigger
                id="ward"
                className="w-full bg-background/80 disabled:opacity-60"
              >
                <SelectValue
                  placeholder={
                    !form.districtId
                      ? "Chọn quận/huyện trước"
                      : isLoadingWards
                        ? "Đang tải phường/xã..."
                        : "Chọn phường/xã"
                  }
                />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                className="h-64 max-h-[65vh] w-(--radix-select-trigger-width) overflow-hidden"
              >
                <div className="sticky top-0 z-10 border-b bg-popover p-2">
                  <Input
                    value={wardKeyword}
                    onChange={(e) => setWardKeyword(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder="Tìm phường/xã..."
                    className="h-8 bg-background"
                  />
                </div>
                {wards.length === 0 ? (
                  <SelectItem value="__empty_ward" disabled>
                    Không có dữ liệu
                  </SelectItem>
                ) : filteredWards.length === 0 ? (
                  <SelectItem value="__not_found_ward" disabled>
                    Không tìm thấy kết quả
                  </SelectItem>
                ) : (
                  filteredWards.map((ward) => (
                    <SelectItem key={ward.id} value={ward.id}>
                      {ward.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Số nhà, tên đường</Label>
        <Input
          id="street"
          value={form.street}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, street: e.target.value }))
          }
          placeholder="123 Đường Lê Lợi"
          className="bg-background/70"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="role">Loại địa chỉ</Label>
          <Select
            value={form.role || "Nhà riêng"}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger id="role" className="w-full bg-background/80">
              <SelectValue placeholder="Chọn loại địa chỉ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nhà riêng">Nhà riêng</SelectItem>
              <SelectItem value="Văn phòng">Văn phòng</SelectItem>
              <SelectItem value="Công ty">Công ty</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Ghi chú</Label>
          <Input
            id="note"
            value={form.note}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, note: e.target.value }))
            }
            placeholder="Giao giờ hành chính"
            className="bg-background/70"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
