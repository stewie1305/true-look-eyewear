import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { FrameSpecForm } from "../components/FrameSpecForm";
import { useFrameSpecDetail, useUpdateFrameSpec } from "../hooks/useFrameSpecs";
import type { UpdateFrameSpecDto } from "../types";

export default function ManageFrameSpecEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: frameSpec, isLoading } = useFrameSpecDetail(id!);
  const { mutate: updateFrameSpec, isPending } = useUpdateFrameSpec();

  const handleSubmit = (data: UpdateFrameSpecDto) => {
    updateFrameSpec({ id: id!, data });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!frameSpec) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy gọng kính</p>
        <Button asChild>
          <Link to="/admin/frame-specs">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/frame-specs">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Chỉnh sửa gọng kính</h2>

      <FrameSpecForm
        defaultValues={{
          product_id: frameSpec.product_id,
          type: frameSpec.type,
          material: frameSpec.material,
          a: Number(frameSpec.a ?? 0),
          b: Number(frameSpec.b ?? 0),
          dbl: Number(frameSpec.dbl ?? 0),
          shape: frameSpec.shape,
          weight: Number(frameSpec.weight ?? 0),
          status: frameSpec.status,
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
