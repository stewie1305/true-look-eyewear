import { useParams } from "react-router-dom";
import {
  useContactLensSpecDetail,
  useUpdateContactLensSpec,
} from "@/features/contactLensSpecs/hooks";
import { ContactLensSpecForm } from "@/features/contactLensSpecs/components/ContactLensSpecForm";
import type { CreateContactLensSpecDto } from "@/features/contactLensSpecs/types";
import { Loader2 } from "lucide-react";

/**
 * Page chỉnh sửa Contact Lens Spec
 * Load dữ liệu hiện tại và cho phép cập nhật
 */
export default function ManageContactLensSpecEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: spec, isLoading } = useContactLensSpecDetail(id!);
  const { mutate: updateSpec, isPending } = useUpdateContactLensSpec();

  const handleSubmit = (data: CreateContactLensSpecDto) => {
    if (id) {
      updateSpec({ id, data });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Không tìm thấy contact lens spec
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Chỉnh sửa Contact Lens Spec
        </h1>
        <p className="text-muted-foreground">
          Cập nhật thông số kỹ thuật kính áp tròng
        </p>
      </div>

      <ContactLensSpecForm
        defaultValues={{
          product_id: spec.product_id,
          base_curve: spec.base_curve,
          diameter: spec.diameter,
          min_sphere: spec.min_sphere,
          max_sphere: spec.max_sphere,
          min_cylinder: spec.min_cylinder,
          max_cylinder: spec.max_cylinder,
          axis_min: spec.axis_min,
          status: spec.status,
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
