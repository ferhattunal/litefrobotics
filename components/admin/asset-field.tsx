"use client";

import { FileUploader } from "@/components/admin/file-uploader";
import type { StorageBucket } from "@/lib/constants";

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  bucket?: StorageBucket;
  accept?: string;
};

export function AssetField({
  name,
  label,
  value,
  onChange,
  bucket = "page-assets",
  accept = "image/*",
}: Props) {
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <FileUploader bucket={bucket} folder="uploads" accept={accept} label={label} value={value} onChange={onChange} />
    </>
  );
}
