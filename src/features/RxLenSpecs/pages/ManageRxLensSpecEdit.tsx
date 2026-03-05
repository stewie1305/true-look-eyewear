import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { RxLensSpecForm } from "../components/RxLensSpecForm";
import { useRxLensSpecDetail, useUpdateRxLensSpec } from "../hooks/useRxLensSpecs";
import type { UpdateRxLensSpecDto } from "./types";

export default function ManageRxLensSpecEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: rxLensSpec, isLoading } = useRxLensSpecDetail(id!);
  const { mutate: updateRxLensSpec, isPending } = useUpdateRxLensSpec();

  const handleSubmit = (data: UpdateRxLensSpecDto) => {
    updateRxLensSpec({ id: id!, data });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!rxLensSpec) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy tròng kính thuốc</p>
        <Button asChild>
          <Link to="/admin/rx-lens-specs">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/rx-lens-specs">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Chỉnh sửa tròng kính thuốc</h2>

      <RxLensSpecForm
        defaultValues={{
          product_id: rxLensSpec.product_id,
          type: rxLensSpec.type,
          material: rxLensSpec.material,
          lens_width: Number(rxLensSpec.lens_width ?? 0),
          min_sphere: Number(rxLensSpec.min_sphere ?? 0),
          max_sphere: Number(rxLensSpec.max_sphere ?? 0),
          min_cylinder: Number(rxLensSpec.min_cylinder ?? 0),
          max_cylinder: Number(rxLensSpec.max_cylinder ?? 0),
          status: rxLensSpec.status,
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
