import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, PackageCheck, PlusCircle, Truck } from "lucide-react";

import { useCreateNhanhOrder } from "@/features/shipping/hooks/useShippingAdmin";
import { useOrdersAdmin } from "@/features/orders/hooks/useOrders";
import { type CreateNhanhOrderDto } from "@/features/shipping/types";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { LoadingSpinner } from "@/shared/components/common";

const EMPTY_FORM: CreateNhanhOrderDto = {
  id: "",
  carrierId: 29,
  carrierName: "SPX Express",
  serviceId: 186,
  serviceName: "Tiêu chuẩn",
  depotId: 230895,
  customerName: "",
  customerMobile: "",
  customerAddress: "",
  customerCityName: "Hồ Chí Minh",
  customerDistrictName: "Quận 1",
  moneyTransfer: 0,
  productList: [
    {
      id: "",
      name: "",
      code: "",
      quantity: 1,
      price: 0,
      weight: 200,
    },
  ],
};

export default function ManageShippingCreateOrderPage() {
  const [form, setForm] = useState<CreateNhanhOrderDto>(EMPTY_FORM);
  const [selectedInternalOrderId, setSelectedInternalOrderId] = useState("");
  const [hiddenInternalOrderIds, setHiddenInternalOrderIds] = useState<
    Set<string>
  >(new Set());

  const createMutation = useCreateNhanhOrder();
  const { orders: internalOrders, isLoading: isLoadingInternalOrders } =
    useOrdersAdmin();

  const confirmedOrders = useMemo(
    () =>
      (Array.isArray(internalOrders) ? internalOrders : []).filter(
        (order) => String(order.status).toLowerCase() === "confirm",
      ),
    [internalOrders],
  );

  const availableConfirmedOrders = useMemo(
    () =>
      confirmedOrders.filter((order) => {
        const rawId = String(order.id || "").trim();
        if (!rawId) return false;

        return !hiddenInternalOrderIds.has(rawId);
      }),
    [confirmedOrders, hiddenInternalOrderIds],
  );

  const applyInternalOrderToForm = (orderId: string) => {
    const picked = availableConfirmedOrders.find(
      (item) => String(item.id) === orderId,
    );
    if (!picked) return;

    setSelectedInternalOrderId(String(picked.id));

    const pickedWithCustomer = picked as typeof picked & {
      customer?: {
        fullName?: string;
        addresses?: Array<{
          name_recipient?: string;
          phone_recipient?: string;
          city?: string;
          district?: string;
          ward?: string;
          street?: string;
        }>;
      };
    };

    const selectedAddress = Array.isArray(
      pickedWithCustomer.customer?.addresses,
    )
      ? pickedWithCustomer.customer?.addresses?.[0]
      : undefined;

    const customerStreet = selectedAddress?.street?.trim() || "";
    const customerWard = selectedAddress?.ward?.trim() || "";
    const composedAddress = [customerStreet, customerWard]
      .filter(Boolean)
      .join(", ");

    setForm((prev) => ({
      ...prev,
      id: String(picked.id),
      customerName:
        prev.customerName ||
        selectedAddress?.name_recipient ||
        pickedWithCustomer.customer?.fullName ||
        `Khách #${picked.customer_id}`,
      customerMobile:
        prev.customerMobile || selectedAddress?.phone_recipient || "",
      customerAddress: prev.customerAddress || composedAddress,
      customerCityName:
        prev.customerCityName ||
        selectedAddress?.city ||
        EMPTY_FORM.customerCityName,
      customerDistrictName:
        prev.customerDistrictName ||
        selectedAddress?.district ||
        EMPTY_FORM.customerDistrictName,
      moneyTransfer: Number(picked.total || 0),
      productList: prev.productList.map((product, index) =>
        index === 0
          ? {
              ...product,
              id: product.id || `ITEM_${picked.id}`,
              code: product.code || String(picked.id),
              name: product.name || `Đơn nội bộ #${picked.id}`,
              quantity: product.quantity || 1,
              price: product.price || Number(picked.total || 0),
            }
          : product,
      ),
    }));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizeOrderRef = (value: string) => value.trim();
    const submittedOrderId = normalizeOrderRef(String(form.id || ""));
    const strippedOrderId = submittedOrderId.replace(/^ORDER_/i, "");
    const refsToHide = [
      normalizeOrderRef(selectedInternalOrderId),
      submittedOrderId,
      strippedOrderId,
    ].filter(Boolean);

    const hideSubmittedOrder = () => {
      if (!refsToHide.length) return;
      setHiddenInternalOrderIds((prev) => {
        const next = new Set(prev);
        refsToHide.forEach((ref) => next.add(ref));
        return next;
      });
      setSelectedInternalOrderId("");
    };

    createMutation.mutate(form, {
      onSuccess: () => {
        hideSubmittedOrder();
        setForm({
          ...EMPTY_FORM,
          id: "",
          customerName: "",
          customerMobile: "",
          customerAddress: "",
          customerCityName: "Hồ Chí Minh",
          customerDistrictName: "Quận 1",
          moneyTransfer: 0,
          productList: [
            { id: "", name: "", code: "", quantity: 1, price: 0, weight: 200 },
          ],
        });
      },
      onError: (error: any) => {
        const errorText = String(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "",
        ).toLowerCase();

        const alreadyCreated =
          errorText.includes("đã tồn tại") ||
          errorText.includes("ton tai") ||
          errorText.includes("already") ||
          errorText.includes("exists") ||
          errorText.includes("duplicate");

        if (alreadyCreated) {
          hideSubmittedOrder();
        }
      },
    });
  };

  const setProductField = (
    key: keyof CreateNhanhOrderDto["productList"][number],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      productList: prev.productList.map((item, index) =>
        index === 0
          ? {
              ...item,
              [key]: ["quantity", "price", "weight"].includes(key)
                ? Number(value || 0)
                : value,
            }
          : item,
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Truck className="h-6 w-6" />
          Tạo đơn giao Nhanh.vn
        </h2>
        <p className="text-sm text-muted-foreground">
          Tạo đơn vận chuyển từ đơn nội bộ đã Confirm.
        </p>
      </div>

      <div className="flex gap-2">
        <Button asChild variant="default">
          <Link to="/admin/shipping-orders/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo đơn
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/shipping-orders/lookup">
            <ListChecks className="mr-2 h-4 w-4" />
            Tra cứu đơn Nhanh
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            Chọn đơn Confirm để fill nhanh
          </CardTitle>
          <CardDescription>
            Bấm “Đẩy vào form tạo Nhanh” để tự điền thông tin đơn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingInternalOrders ? (
            <LoadingSpinner />
          ) : availableConfirmedOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Không còn đơn Confirm nào chờ tạo Nhanh.
            </p>
          ) : (
            <div className="space-y-2">
              {availableConfirmedOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="text-sm">
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-muted-foreground">
                      KH: {order.customer_id} •{" "}
                      {Number(order.total || 0).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyInternalOrderToForm(order.id)}
                  >
                    Đẩy vào form tạo Nhanh
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tạo đơn giao hàng</CardTitle>
          <CardDescription>
            Tạo đơn thật lên Nhanh.vn theo payload staff API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleCreateOrder}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order-id">Mã đơn</Label>
                <Input
                  id="order-id"
                  value={form.id}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, id: e.target.value }))
                  }
                  placeholder="ORDER_TEST_001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depot-id">Depot ID</Label>
                <Input
                  id="depot-id"
                  type="number"
                  value={form.depotId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      depotId: Number(e.target.value || 0),
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="carrier-id">Carrier ID</Label>
                <Input
                  id="carrier-id"
                  type="number"
                  value={form.carrierId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      carrierId: Number(e.target.value || 0),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-id">Service ID</Label>
                <Input
                  id="service-id"
                  type="number"
                  value={form.serviceId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      serviceId: Number(e.target.value || 0),
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="carrier-name">Carrier name</Label>
                <Input
                  id="carrier-name"
                  value={form.carrierName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      carrierName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-name">Service name</Label>
                <Input
                  id="service-name"
                  value={form.serviceName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      serviceName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Tên khách hàng</Label>
                <Input
                  id="customer-name"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      customerName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-mobile">Số điện thoại</Label>
                <Input
                  id="customer-mobile"
                  value={form.customerMobile}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      customerMobile: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-address">Địa chỉ</Label>
              <Input
                id="customer-address"
                value={form.customerAddress}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    customerAddress: e.target.value,
                  }))
                }
                placeholder="123 Nguyễn Huệ"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer-city">Tỉnh/Thành</Label>
                <Input
                  id="customer-city"
                  value={form.customerCityName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      customerCityName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-district">Quận/Huyện</Label>
                <Input
                  id="customer-district"
                  value={form.customerDistrictName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      customerDistrictName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2 rounded-lg border p-4">
              <p className="text-sm font-medium">Sản phẩm đầu tiên</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  value={form.productList[0]?.id || ""}
                  onChange={(e) => setProductField("id", e.target.value)}
                  placeholder="Mã nội bộ"
                />
                <Input
                  value={form.productList[0]?.code || ""}
                  onChange={(e) => setProductField("code", e.target.value)}
                  placeholder="SKU / code"
                />
                <Input
                  value={form.productList[0]?.name || ""}
                  onChange={(e) => setProductField("name", e.target.value)}
                  placeholder="Tên sản phẩm"
                  className="md:col-span-2"
                />
                <Input
                  type="number"
                  value={form.productList[0]?.quantity || 0}
                  onChange={(e) => setProductField("quantity", e.target.value)}
                  placeholder="Số lượng"
                />
                <Input
                  type="number"
                  value={form.productList[0]?.price || 0}
                  onChange={(e) => setProductField("price", e.target.value)}
                  placeholder="Giá"
                />
                <Input
                  type="number"
                  value={form.productList[0]?.weight || 0}
                  onChange={(e) => setProductField("weight", e.target.value)}
                  placeholder="Khối lượng (gram)"
                />
                <Input
                  type="number"
                  value={form.moneyTransfer}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      moneyTransfer: Number(e.target.value || 0),
                    }))
                  }
                  placeholder="COD / chuyển thu"
                />
              </div>
            </div>

            <Button
              className="w-full"
              disabled={createMutation.isPending}
              type="submit"
            >
              {createMutation.isPending ? "Đang tạo..." : "Tạo đơn Nhanh"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
