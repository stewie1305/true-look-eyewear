import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon } from "lucide-react";

import { useImageBlob } from "../hooks/useImages";
import { getImageUrl } from "@/lib/env";

interface ImagePreviewProps {
  id?: string;
  path?: string;
  alt?: string;
  className?: string;
  placeholderClassName?: string;
}

export function ImagePreview({
  id,
  path,
  alt = "Image",
  className,
  placeholderClassName = "h-5 w-5 text-muted-foreground",
}: ImagePreviewProps) {
  const { data: blob, isError } = useImageBlob(id);
  const [objectUrl, setObjectUrl] = useState<string>("");
  const [fallbackError, setFallbackError] = useState(false);
  const [blobValid, setBlobValid] = useState<boolean | null>(null);

  useEffect(() => {
    setObjectUrl("");
    setBlobValid(null);
    setFallbackError(false);
  }, [id, path]);

  useEffect(() => {
    if (!blob) return;
    if (!blob.type || !blob.type.startsWith("image/")) {
      setBlobValid(false);
      setObjectUrl("");
      return;
    }
    setBlobValid(true);
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  const fallbackSrc = useMemo(() => getImageUrl(path), [path]);
  const shouldUseFallback = isError || blobValid === false;
  const src = objectUrl || (shouldUseFallback ? fallbackSrc : "");

  return (
    <div className="flex h-full w-full items-center justify-center">
      {!src || fallbackError ? (
        <ImageIcon className={placeholderClassName} />
      ) : (
        <img
          src={src}
          alt={alt}
          className={className}
          loading="lazy"
          onError={() => setFallbackError(true)}
        />
      )}
    </div>
  );
}
