import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
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

  useEffect(() => {
    setForm({
      name_recipient: defaultValues?.name_recipient || "",
      phone_recipient: defaultValues?.phone_recipient || "",
      city: defaultValues?.city || "",
      district: defaultValues?.district || "",
      ward: defaultValues?.ward || "",
      street: defaultValues?.street || "",
      note: defaultValues?.note || "",
      role: defaultValues?.role || "",
    });
  }, [defaultValues]);

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
    <form onSubmit={handleSubmit} className="space-y-4">
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
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">Tỉnh/Thành phố</Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, city: e.target.value }))
            }
            placeholder="Hồ Chí Minh"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">Quận/Huyện</Label>
          <Input
            id="district"
            value={form.district}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, district: e.target.value }))
            }
            placeholder="Quận 1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ward">Phường/Xã</Label>
          <Input
            id="ward"
            value={form.ward}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, ward: e.target.value }))
            }
            placeholder="Phường Bến Nghé"
          />
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
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="role">Loại địa chỉ</Label>
          <Input
            id="role"
            value={form.role}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, role: e.target.value }))
            }
            placeholder="Nhà riêng"
          />
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
