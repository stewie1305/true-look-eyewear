import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  useContactLensSpecs,
  useDeleteContactLensSpec,
} from "@/features/contactLensSpecs/hooks";
import { ContactLensSpecTable } from "@/features/contactLensSpecs/components/ContactLensSpecTable";
import { useSearchParams } from "react-router-dom";

export default function ManageContactLensSpecList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  const { contactLensSpecs, isLoading } = useContactLensSpecs();
  const { mutate: deleteSpec, isPending: isDeleting } =
    useDeleteContactLensSpec();

  // Update URL khi search thay đổi
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1"); // Reset về page 1
    setSearchParams(newParams);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa contact lens spec này?")) {
      deleteSpec(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Contact Lens Specs
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông số kỹ thuật kính áp tròng
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/contact-lens-specs/create">
            <Plus className="mr-2 h-4 w-4" />
            Thêm Spec
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Contact Lens Specs</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả thông số kỹ thuật kính áp tròng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo product name, code..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : (
            <ContactLensSpecTable
              data={contactLensSpecs}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
