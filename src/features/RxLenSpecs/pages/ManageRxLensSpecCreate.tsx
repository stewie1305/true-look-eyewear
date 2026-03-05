import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { RxLensSpecForm } from "../components/RxLensSpecForm";
import { useCreateRxLensSpec } from "../hooks/useRxLensSpecs";
import type { CreateRxLensSpecDto } from "./types";

export function ManageRxLensSpecCreate() {
  const { mutate: createRxLensSpec, isPending } = useCreateRxLensSpec();

  const handleSubmit = (data: CreateRxLensSpecDto) => {
    createRxLensSpec(data);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/rx-lens-specs">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Tạo tròng kính thuốc mới</h2>

      <RxLensSpecForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo tròng kính thuốc"
      />
    </div>
  );
}

export default ManageRxLensSpecCreate;
