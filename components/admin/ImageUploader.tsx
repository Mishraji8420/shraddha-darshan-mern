"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import { useAdminToast } from "./AdminToastProvider";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useAdminToast();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          showToast("error", data.error || `Failed to upload ${file.name}`);
          continue;
        }
        uploaded.push(data.url);
      } catch {
        showToast("error", `Failed to upload ${file.name}`);
      }
    }

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]"
            >
              <Image src={url} alt="" fill className="object-cover" />
              {index === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-md bg-yellow-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                  Main
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label="Remove image"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X size={13} />
              </button>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  aria-label="Move image earlier"
                  className="absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-0"
                >
                  <GripVertical size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-[#0a0a0a] px-4 py-6 text-center transition hover:border-yellow-400/40">
        {uploading ? (
          <Loader2 size={20} className="animate-spin text-yellow-400" />
        ) : (
          <Upload size={20} className="text-gray-500" />
        )}
        <span className="text-sm text-gray-400">
          {uploading ? "Uploading..." : "Click to upload images (PNG, JPEG, WEBP — max 5MB each)"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>
    </div>
  );
}
