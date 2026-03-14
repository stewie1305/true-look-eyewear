import { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useImageVariantOptions } from "@/features/images/hooks/useImages";
import type { CreateImagePayload } from "@/features/images/types";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface ImageFormProps {
  onSubmit: (data: CreateImagePayload) => void;
  isPending?: boolean;
  submitLabel?: string;
}

interface ImageFormValues {
  variant_id: string;
}

export function ImageForm({
  onSubmit,
  isPending = false,
  submitLabel = "Lưu ảnh",
}: ImageFormProps) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const { variants, isLoading: isLoadingVariants } = useImageVariantOptions();
  const { register, handleSubmit, setValue, watch } = useForm<ImageFormValues>({
    defaultValues: {
      variant_id: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPath, setPreviewPath] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const selectedVariantId = watch("variant_id");

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewPath(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setFileError("Kích thước ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.");
      event.target.value = "";
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  const submitForm = (values: ImageFormValues) => {
    if (!selectedFile) {
      setFileError("Vui lòng chọn file ảnh");
      return;
    }

    onSubmit({
      variant_id: values.variant_id,
      file: selectedFile,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin ảnh</CardTitle>
          <CardDescription>Chọn variant và tải ảnh từ máy lên.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="variant_id">Variant (không bắt buộc)</Label>
            <Select
              value={selectedVariantId || "__none__"}
              onValueChange={(value) => {
                setValue("variant_id", value === "__none__" ? "" : value, {
                  shouldValidate: true,
                });
              }}
              disabled={isLoadingVariants}
            >
              <SelectTrigger id="variant_id">
                <SelectValue
                  placeholder={
                    isLoadingVariants
                      ? "Đang tải variants..."
                      : "Chọn variant (tuỳ chọn)"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Không chọn variant</SelectItem>
                {variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {variant.code} • {variant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("variant_id")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-file">
              Chọn ảnh từ máy <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-3 rounded-lg border border-dashed px-4 py-3">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border-0 p-0 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Chọn file ảnh trong máy, hệ thống sẽ tự đọc để xem trước và gửi
              lên API.
            </p>
            {fileError && (
              <p className="text-sm text-destructive">{fileError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Xem trước</Label>
            <div className="flex h-64 items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {previewPath ? (
                <img
                  src={previewPath}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-10 w-10" />
                  <span className="text-sm">Chọn file để xem trước ảnh</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link to="/admin/images">Hủy</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
