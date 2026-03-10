import { useCreateContactLensSpec } from "@/features/contactLensSpecs/hooks";
import { ContactLensSpecForm } from "@/features/contactLensSpecs/components/ContactLensSpecForm";
import type { CreateContactLensSpecDto } from "@/features/contactLensSpecs/types";

/**
 * Page tạo Contact Lens Spec mới
 * axis_min được chọn từ danh sách ContactLensAxis có sẵn
 */
export default function ManageContactLensSpecCreate() {
  const { mutate: createSpec, isPending } = useCreateContactLensSpec();

  const handleSubmit = (data: CreateContactLensSpecDto) => {
    createSpec(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tạo Contact Lens Spec
        </h1>
        <p className="text-muted-foreground">
          Thêm thông số kỹ thuật mới cho kính áp tròng
        </p>
      </div>

      <ContactLensSpecForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo Spec"
      />
    </div>
  );
}
