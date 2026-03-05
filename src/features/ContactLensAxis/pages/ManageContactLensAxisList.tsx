import {
  useContactLensAxis,
  useDeleteContactLensAxis,
} from "../hooks/useContactLensAxis";
import { ContactLensAxisTable } from "../components/ContactLensAxisTable";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";

export function ManageContactLensAxisList() {
  const { contactLensAxis, pagination, isLoading } = useContactLensAxis();
  const deleteContactLensAxis = useDeleteContactLensAxis();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      searchParams.set("search", value);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  const handleStatusChange = (value: string) => {
    if (value && value !== "all") {
      searchParams.set("status", value);
    } else {
      searchParams.delete("status");
    }
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn chắc chắn muốn xóa?")) {
      deleteContactLensAxis.mutate(id);
    }
  };

  const handlePageChange = (newPage: number) => {
    searchParams.set("page", String(newPage));
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Lens Axis</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý contact lens axis thông tin
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/contact-lens-axis/create">
            <Plus className="w-4 h-4 mr-2" />
            Tạo mới
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px]">
          <Input
            placeholder="Tìm kiếm..."
            value={searchParams.get("search") || ""}
            onChange={handleSearch}
          />
        </div>
        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <ContactLensAxisTable
            data={contactLensAxis}
            onDelete={handleDelete}
            isDeleting={deleteContactLensAxis.isPending}
          />
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Hiển thị {contactLensAxis.length} / {pagination.totalItems} kết quả
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Tiếp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
