import { useEffect, useState, useRef } from "react";
import { useAddressAutocomplete } from "@/features/shipping/hooks/useShippingLocations";
import { useDebounce } from "@/shared/hooks/useDebounce";
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
import { MapPin, Search, Loader2 } from "lucide-react";
import type { Address, CreateAddressDto, UpdateAddressDto } from "../types";

type AddressFormState = {
  name_recipient: string;
  phone_recipient: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  note: string;
  role: string;
  ref_id: string;
};

const EMPTY_FORM: AddressFormState = {
  name_recipient: "",
  phone_recipient: "",
  city: "",
  district: "",
  ward: "",
  street: "",
  note: "",
  role: "",
  ref_id: "",
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

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const { data: suggestionsRaw, isLoading: isLoadingSuggestions } = useAddressAutocomplete(debouncedSearchTerm);

  const suggestions = Array.isArray(suggestionsRaw) ? suggestionsRaw : suggestionsRaw?.results || suggestionsRaw?.data || suggestionsRaw?.features || [];

  useEffect(() => {
    if (defaultValues) {
      setForm({
        name_recipient: defaultValues.name_recipient || "",
        phone_recipient: defaultValues.phone_recipient || "",
        city: defaultValues.city || "",
        district: defaultValues.district || "",
        ward: defaultValues.ward || "",
        street: defaultValues.street || "",
        note: defaultValues.note || "",
        role: defaultValues.role || "",
        ref_id: defaultValues.ref_id || "",
      });
      // Build a full address for the search term if it's an edit
      if (defaultValues.street && defaultValues.city) {
        setSearchTerm(`${defaultValues.street}, ${defaultValues.ward}, ${defaultValues.district}, ${defaultValues.city}`);
      }
    }
  }, [defaultValues]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getAddressText = (item: any) => item.display || item.address || item.name || item.text || String(item);

  const handleSelectAddress = (item: any) => {
    const addressString = getAddressText(item);
    let city = "";
    let district = "";
    let ward = "";
    let street = "";

    if (item.boundaries && Array.isArray(item.boundaries)) {
      // Parse from boundaries if available (VietMap format)
      // type 0: City, type 1: District, type 2: Ward
      const cityObj = item.boundaries.find((b: any) => b.type === 0);
      const districtObj = item.boundaries.find((b: any) => b.type === 1);
      const wardObj = item.boundaries.find((b: any) => b.type === 2);

      if (cityObj) city = cityObj.full_name || cityObj.name;
      if (districtObj) district = districtObj.full_name || districtObj.name;
      if (wardObj) ward = wardObj.full_name || wardObj.name;
      
      // The street is usually item.name
      street = item.name || addressString;
    } else {
      // Fallback to string splitting
      const parts = addressString.split(",").map((p: string) => p.trim());
      if (parts.length >= 4) {
         city = parts[parts.length - 1];
         district = parts[parts.length - 2];
         ward = parts[parts.length - 3];
         street = parts.slice(0, parts.length - 3).join(", ");
      } else if (parts.length === 3) {
         city = parts[2];
         district = parts[1]; // might be district or ward
         ward = parts[1]; // fallback, we don't know for sure
         street = parts[0];
      } else if (parts.length === 2) {
         city = parts[1];
         district = parts[0];
         ward = "";
         street = parts[0];
      } else {
         street = addressString;
      }
    }

    setForm(prev => ({
       ...prev,
       city, district, ward, street, ref_id: item.ref_id || "",
    }));
    setSearchTerm(addressString);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name_recipient.trim())
      return setError("Vui lòng nhập tên người nhận");
    if (!form.phone_recipient.trim())
      return setError("Vui lòng nhập số điện thoại");
    
    // Ensure street is populated if we have a search term but parsing failed to get street
    if (!form.street.trim() && searchTerm.trim()) {
      form.street = searchTerm.trim();
    } else if (!form.street.trim()) {
      return setError("Vui lòng tìm kiếm và chọn một địa chỉ giao hàng hợp lệ");
    }

    const payload: CreateAddressDto = {
      name_recipient: form.name_recipient.trim(),
      phone_recipient: form.phone_recipient.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      ward: form.ward.trim(),
      street: form.street.trim(),
      note: form.note.trim(),
      role: form.role.trim() || "Nhà riêng",
      ...(form.ref_id ? { ref_id: form.ref_id } : {}),
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
          <p className="text-sm font-medium">Tìm kiếm địa chỉ giao hàng</p>
          <p className="text-xs text-muted-foreground">
            Nhập số nhà, tên đường, phường/xã để tìm kiếm nhanh
          </p>
        </div>

        <div className="relative" ref={autocompleteRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Ví dụ: 88 Phước Thiện, Phường Long Bình..."
              className="pl-9 bg-background"
            />
            {isLoadingSuggestions && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && searchTerm.trim().length > 2 && (
            <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
              <ul className="max-h-60 overflow-auto p-1">
                {isLoadingSuggestions ? (
                  <li className="relative flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm outline-none">
                    Đang tìm kiếm...
                  </li>
                ) : suggestions.length > 0 ? (
                  suggestions.map((item: any, idx: number) => {
                    const text = getAddressText(item);
                    return (
                      <li
                        key={idx}
                        className="relative flex cursor-pointer select-none items-start gap-2 rounded-sm px-2 py-2.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        onClick={() => handleSelectAddress(item)}
                      >
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                        <span>{text}</span>
                      </li>
                    );
                  })
                ) : (
                  <li className="relative flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm outline-none">
                    Không tìm thấy địa chỉ phù hợp
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Display parsed fields to let user know it was recognized */}
        {(form.city || form.district || form.ward || form.street) && (
          <div className="mt-4 p-3 bg-background border border-border/50 rounded-md text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 shadow-sm">
            {form.street && form.street !== "Unknown" && (
              <div><span className="font-medium text-foreground">Đường:</span> {form.street}</div>
            )}
            {form.ward && form.ward !== "Unknown" && (
              <div><span className="font-medium text-foreground">Phường/Xã:</span> {form.ward}</div>
            )}
            {form.district && form.district !== "Unknown" && (
              <div><span className="font-medium text-foreground">Quận/Huyện:</span> {form.district}</div>
            )}
            {form.city && form.city !== "Unknown" && (
              <div><span className="font-medium text-foreground">Tỉnh/TP:</span> {form.city}</div>
            )}
          </div>
        )}
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
