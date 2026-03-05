import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { FrameSpecForm } from "../components/FrameSpecForm";
import { useCreateFrameSpec } from "../hooks/useFrameSpecs";
import type { CreateFrameSpecDto } from "../types";

export function ManageFrameSpecCreate() {
  const { mutate: createFrameSpec, isPending } = useCreateFrameSpec();

  const handleSubmit = (data: CreateFrameSpecDto) => {
    createFrameSpec(data);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/frame-specs">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Tạo gọng kính mới</h2>

      <FrameSpecForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo gọng kính"
      />
    </div>
  );
}

export default ManageFrameSpecCreate;
