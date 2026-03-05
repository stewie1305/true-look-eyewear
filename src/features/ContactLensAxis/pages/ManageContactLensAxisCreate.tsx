import { useCreateContactLensAxis } from "../hooks/useContactLensAxis";
import { ContactLensAxisForm } from "../components/ContactLensAxisForm";
import type { CreateContactLensAxisDto } from "../types";

export function ManageContactLensAxisCreate() {
  const mutation = useCreateContactLensAxis();

  const handleSubmit = (data: CreateContactLensAxisDto) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tạo Contact Lens Axis</h1>
        <p className="text-muted-foreground mt-1">
          Thêm contact lens axis mới vào hệ thống
        </p>
      </div>

      <ContactLensAxisForm
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
        submitLabel="Tạo"
      />
    </div>
  );
}
