"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { UploadCloud, Download, CheckCircle2, Trash2, ArrowRight } from "lucide-react";
import { compressImage, formatBytes } from "@/lib/image-utils";

interface QuickItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  url: string;
  ext: string;
}

export default function QuickCompressHero() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<QuickItem[]>([]);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const valid = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) return;

    setBusy(true);
    try {
      const results: QuickItem[] = [];
      for (const file of valid.slice(0, 5)) {
        const res = await compressImage(file, {
          quality: 0.76,
          maxWidth: 1920,
          format: "image/webp",
        });
        results.push({
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          originalSize: file.size,
          compressedSize: res.blob.size,
          url: res.url,
          ext: "webp",
        });
      }
      setItems((prev) => [...results, ...prev]);
    } finally {
      setBusy(false);
    }
  };

  const clearAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.url));
    setItems([]);
  };

  useEffect(() => {
    return () => {
      items.forEach((i) => URL.revokeObjectURL(i.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-indigo-200/80 bg-white/95 p-4 shadow-lg shadow-indigo-900/5 backdrop-blur-xs sm:p-5">
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
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all ${
          dragging
            ? "border-indigo-600 bg-indigo-50/70"
            : "border-indigo-200 bg-indigo-50/30 hover:border-indigo-400 hover:bg-indigo-50/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">
          <UploadCloud className="h-5 w-5" />
        </span>
        <p className="text-sm font-bold text-slate-900 sm:text-base">
          {busy
            ? "Compressing instantly in your browser..."
            : "Drop any JPG, PNG, or WebP here to compress instantly"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Zero uploads &bull; Instant WebP optimization &bull; Up to 80% smaller
        </p>
      </div>

      {items.length > 0 && (
        <div className="mt-4 space-y-2.5 text-left">
          {items.map((item) => {
            const pct = Math.max(
              0,
              Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100)
            );
            return (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="max-w-[220px] truncate text-xs font-bold text-slate-900 sm:max-w-xs">
                    {item.name}.{item.ext}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-600">
                    <span>
                      {formatBytes(item.originalSize)} &rarr;{" "}
                      <strong className="text-slate-900">
                        {formatBytes(item.compressedSize)}
                      </strong>
                    </span>
                    {pct > 0 && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />-{pct}%
                      </span>
                    )}
                  </p>
                </div>
                <a
                  href={item.url}
                  download={`${item.name}-compressed.${item.ext}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <Link
              href="/compress-image"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Need custom quality or JPG/PNG output? Open full compressor
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
