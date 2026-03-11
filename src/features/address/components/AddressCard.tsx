import { MapPin, Pencil, Phone, Trash2, User } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { Address } from "../types";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  deletingId?: string;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  deletingId,
}: AddressCardProps) {
  return (
    <Card className="border-border/60">
      <CardContent className="space-y-3 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-primary">
            {address.role || "Địa chỉ giao hàng"}
          </p>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Sửa
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(address.id)}
              disabled={deletingId === address.id}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Xóa
            </Button>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium">{address.name_recipient}</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            {address.phone_recipient}
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" />
            <span>
              {address.street}, {address.ward}, {address.district},{" "}
              {address.city}
            </span>
          </p>
          {address.note && (
            <p className="text-muted-foreground">Ghi chú: {address.note}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
