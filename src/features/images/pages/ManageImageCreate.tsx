import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { ImageForm } from "@/features/images/components/ImageForm";
import { useCreateImage } from "@/features/images/hooks/useImages";
import type { CreateImagePayload } from "@/features/images/types";
import { Button } from "@/shared/components/ui/button";

export default function ManageImageCreate() {
  const { mutate: createImage, isPending } = useCreateImage();

  const handleSubmit = (data: CreateImagePayload) => {
    createImage(data);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/images">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Thêm ảnh variant mới</h2>

      <ImageForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo ảnh"
      />
    </div>
  );
}
