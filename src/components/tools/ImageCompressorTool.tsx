"use client";

import { useState, useEffect } from "react";
import { Download, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";
import Dropzone from "@/components/Dropzone";
import {
  compressImage,
  formatBytes,
  type OutputFormat,
} from "@/lib/image-utils";

interface CompressedItem {
  id: string;
  file: File;
  originalUrl: string;
  compressedUrl: string;
  compressedSize: number;
  width: number;
  height: number;
  mimeType: string;
}

export default function ImageCompressorTool() {
  const [quality, setQuality] = useState(75);
  const [maxWidth, setMaxWidth] = useState(0);
  const [format, setFormat] = useState<OutputFormat>("original");
  const [items, setItems] = useState<CompressedItem[]>([]);
  const [processing, setProcessing] = useState(false);

  const processFiles = async (
    files: File[],
    q: number,
    mw: number,
    fmt: OutputFormat
  ) => {
    setProcessing(true);
    try {
      const results: CompressedItem[] = [];
      for (const file of files) {
        const res = await compressImage(file, {
          quality: q / 100,
          maxWidth: mw,
          format: fmt,
        });
        results.push({
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
          file,
          originalUrl: URL.createObjectURL(file),
          compressedUrl: res.url,
          compressedSize: res.blob.size,
          width: res.width,
          height: res.height,
          mimeType: res.mimeType,
        });
      }
      setItems((prev) => [...prev, ...results]);
    } finally {
      setProcessing(false);
    }
  };

  const recompressAll = async () => {
    if (items.length === 0) return;
    setProcessing(true);
    try {
      const updated = await Promise.all(
        items.map(async (item) => {
          URL.revokeObjectURL(item.compressedUrl);
          const res = await compressImage(item.file, {
            quality: quality / 100,
            maxWidth,
            format,
          });
          return {
            ...item,
            compressedUrl: res.url,
            compressedSize: res.blob.size,
            width: res.width,
            height: res.height,
            mimeType: res.mimeType,
          };
        })
      );
      setItems(updated);
    } finally {
      setProcessing(false);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.originalUrl);
        URL.revokeObjectURL(target.compressedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      URL.revokeObjectURL(item.compressedUrl);
    });
    setItems([]);
  };

  useEffect(() => {
    return () => {
      items.forEach((item) => {
        URL.revokeObjectURL(item.originalUrl);
        URL.revokeObjectURL(item.compressedUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDownloadName = (item: CompressedItem) => {
    const base = item.file.name.replace(/\.[^/.]+$/, "");
    const ext =
      item.mimeType === "image/webp"
        ? "webp"
        : item.mimeType === "image/png"
          ? "png"
          : "jpg";
    return `${base}-compressed.${ext}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label
              htmlFor="quality-slider"
              className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700"
            >
              <span>Compression Quality</span>
              <span className="font-semibold text-indigo-600">{quality}%</span>
            </label>
            <input
              id="quality-slider"
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="mt-1 text-xs text-slate-500">
              70–80% gives the best balance of size and visual clarity.
            </p>
          </div>

          <div>
            <label
              htmlFor="max-width-select"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Resize Max Width
            </label>
            <select
              id="max-width-select"
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value={0}>Keep Original Dimensions</option>
              <option value={1920}>1920px (Full HD)</option>
              <option value={1280}>1280px (Web Standard)</option>
              <option value={800}>800px (Blog / Thumbnail)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="format-select"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Output Format
            </label>
            <select
              id="format-select"
              value={format}
              onChange={(e) => setFormat(e.target.value as OutputFormat)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value="original">Same as Original</option>
              <option value="image/webp">WebP (Smallest Size)</option>
              <option value="image/jpeg">JPEG (Universal)</option>
              <option value="image/png">PNG (Lossless)</option>
            </select>
          </div>
        </div>

        {items.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={recompressAll}
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${processing ? "animate-spin" : ""}`} />
              Apply New Settings
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      <Dropzone
        multiple
        label="Drop images here to compress (batch supported)"
        sublabel="JPG, PNG, or WebP — files never leave your device"
        onFilesSelected={(files) => processFiles(files, quality, maxWidth, format)}
      />

      {processing && (
        <p className="text-center text-sm font-medium text-indigo-600">
          Compressing your images...
        </p>
      )}

      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => {
            const savedBytes = item.file.size - item.compressedSize;
            const savedPct = Math.round((savedBytes / item.file.size) * 100);
            const isSmaller = savedBytes > 0;

            return (
              <div
                key={item.id}
                className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.compressedUrl}
                    alt={item.file.name}
                    className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                  />
                  <div>
                    <p className="max-w-xs truncate text-sm font-semibold text-slate-900">
                      {item.file.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.width} × {item.height}px &middot;{" "}
                      {formatBytes(item.file.size)} &rarr;{" "}
                      <span className="font-semibold text-slate-900">
                        {formatBytes(item.compressedSize)}
                      </span>
                    </p>
                    <div className="mt-1">
                      {isSmaller ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Saved {savedPct}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Try WebP or lower quality for smaller size
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                  <a
                    href={item.compressedUrl}
                    download={getDownloadName(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
