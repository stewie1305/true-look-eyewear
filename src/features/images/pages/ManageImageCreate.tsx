import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ImageForm } from "../components/ImageForm";
import { useCreateImage } from "../hooks/useImages";
import type { CreateImagePayload } from "../types";

export function ManageImageCreate() {
  const { mutate: createImage, isPending } = useCreateImage();

  const handleSubmit = (data: CreateImagePayload) => {
    createImage(data);
  };

  return (
    <div className="mx-auto max-w-2xl">
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

export default ManageImageCreate;
