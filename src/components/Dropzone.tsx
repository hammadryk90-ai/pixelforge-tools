"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

interface DropzoneProps {
  accept?: string;
  multiple?: boolean;
  label?: string;
  sublabel?: string;
  onFilesSelected: (files: File[]) => void;
}

export default function Dropzone({
  accept = "image/jpeg,image/png,image/webp",
  multiple = false,
  label = "Drop your images here, or click to browse",
  sublabel = "Supports JPG, PNG, WebP — processed 100% locally in your browser",
  onFilesSelected,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const valid = Array.from(fileList).filter(
      (f) =>
        f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name)
    );
    if (valid.length > 0) {
      onFilesSelected(valid);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all sm:p-12 ${
        isDragging
          ? "border-indigo-600 bg-indigo-50/70"
          : "border-slate-300 bg-slate-50/70 hover:border-indigo-400 hover:bg-indigo-50/30"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <UploadCloud className="h-6 w-6" />
      </div>
      <p className="text-base font-semibold text-slate-800">{label}</p>
      <p className="mt-1 text-sm text-slate-500">{sublabel}</p>
    </div>
  );
}
