import { useState } from "react";
import { ArrowLeft, Loader2, MapPinPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AddressCard } from "@/features/address/components/AddressCard";
import { AddressForm } from "@/features/address/components/AddressForm";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "@/features/address/hooks/useAddresses";
import type {
  Address,
  CreateAddressDto,
  UpdateAddressDto,
} from "@/features/address/types";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function AddressPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutState = location.state as {
    fromCheckout?: boolean;
    returnTo?: string;
    selectedCartItemIds?: string[];
  } | null;
  const fromCheckout = !!checkoutState?.fromCheckout;
  const returnTo = checkoutState?.returnTo || "/cart";

  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { addresses, isLoading, error } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const shouldOpenCreateForm = fromCheckout && !editingAddress;

  const closeForm = () => {
    setIsAdding(false);
    setEditingAddress(null);
  };

  const handleCreateAddress = (data: CreateAddressDto | UpdateAddressDto) => {
    createAddressMutation.mutate(data as CreateAddressDto, {
      onSuccess: (createdAddress) => {
        if (fromCheckout) {
          navigate(returnTo, {
            replace: true,
            state: {
              autoCheckout: true,
              checkoutWithAddress: createdAddress,
              selectedCartItemIds: checkoutState?.selectedCartItemIds,
            },
          });
          return;
        }
        closeForm();
      },
    });
  };

  const handleUpdateAddress = (data: CreateAddressDto | UpdateAddressDto) => {
    if (!editingAddress?.id) return;
    updateAddressMutation.mutate(
      { id: editingAddress.id, data: data as UpdateAddressDto },
      {
        onSuccess: closeForm,
      },
    );
  };

  const handleDeleteAddress = (id: string) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa địa chỉ này?");
    if (!confirmed) return;
    deleteAddressMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Không tải được địa chỉ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Vui lòng thử lại sau."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Địa chỉ của tôi</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý địa chỉ nhận hàng cho tài khoản của bạn.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về profile
            </Link>
          </Button>
          <Button
            onClick={() => {
              setEditingAddress(null);
              setIsAdding((prev) => !prev);
            }}
          >
            <MapPinPlus className="mr-2 h-4 w-4" />
            {isAdding ? "Đóng form" : "Thêm địa chỉ"}
          </Button>
        </div>
      </div>

      {(isAdding || editingAddress || shouldOpenCreateForm) && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>
              {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            </CardTitle>
            <CardDescription>
              Nhập thông tin người nhận và địa chỉ giao hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddressForm
              defaultValues={editingAddress || undefined}
              onSubmit={
                editingAddress ? handleUpdateAddress : handleCreateAddress
              }
              onCancel={closeForm}
              isEdit={!!editingAddress}
              isPending={
                createAddressMutation.isPending ||
                updateAddressMutation.isPending
              }
              submitLabel={editingAddress ? "Lưu thay đổi" : "Tạo địa chỉ"}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {!addresses.length ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ đầu tiên.
            </CardContent>
          </Card>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={(value) => {
                setEditingAddress(value);
                setIsAdding(false);
              }}
              onDelete={handleDeleteAddress}
              deletingId={
                deleteAddressMutation.variables
                  ? String(deleteAddressMutation.variables)
                  : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
