import { useParams } from "react-router-dom";
import {
  useContactLensAxisDetail,
  useUpdateContactLensAxis,
} from "../hooks/useContactLensAxis";
import { ContactLensAxisForm } from "../components/ContactLensAxisForm";
import { Loader2 } from "lucide-react";
import type { UpdateContactLensAxisDto } from "../types";

export function ManageContactLensAxisEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: contactLensAxis, isLoading } = useContactLensAxisDetail(
    id || "",
  );
  const mutation = useUpdateContactLensAxis();

  const handleSubmit = (data: UpdateContactLensAxisDto) => {
    if (id) {
      mutation.mutate({ id, data });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!contactLensAxis) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Không tìm thấy dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chỉnh sửa Contact Lens Axis</h1>
        <p className="text-muted-foreground mt-1">
          Cập nhật thông tin contact lens axis
        </p>
      </div>

      <ContactLensAxisForm
        defaultValues={contactLensAxis}
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
