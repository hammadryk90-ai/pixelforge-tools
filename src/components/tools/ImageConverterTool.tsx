"use client";

import { useState, useEffect } from "react";
import { Download, Trash2, RefreshCw, CheckCircle2, Sparkles } from "lucide-react";
import Dropzone from "@/components/Dropzone";
import { formatBytes, loadImageFromFile } from "@/lib/image-utils";

type TargetFormat =
  | "auto-smallest"
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/avif";

interface ConvertedItem {
  id: string;
  file: File;
  outputUrl: string;
  outputSize: number;
  outputMime: string;
  width: number;
  height: number;
  fallbackNote?: string;
}

const FORMAT_OPTIONS: { id: TargetFormat; label: string; hint: string }[] = [
  { id: "auto-smallest", label: "Smallest (Auto)", hint: "Picks smallest file" },
  { id: "image/jpeg", label: "JPEG", hint: "Best for HEIC & photos" },
  { id: "image/png", label: "PNG", hint: "Lossless & transparent" },
  { id: "image/webp", label: "WebP", hint: "Modern web standard" },
  { id: "image/avif", label: "AVIF", hint: "Ultra-small next-gen" },
];

function mimeToExt(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/avif") return "avif";
  return "jpg";
}

function mimeToLabel(mime: string): string {
  if (mime === "image/png") return "PNG";
  if (mime === "image/webp") return "WebP";
  if (mime === "image/avif") return "AVIF";
  return "JPEG";
}

async function normalizeInputFile(file: File): Promise<File> {
  const isHeic =
    /\.(heic|heif)$/i.test(file.name) ||
    file.type === "image/heic" ||
    file.type === "image/heif";

  if (!isHeic) return file;

  const heic2anyModule = await import("heic2any");
  const heic2any = heic2anyModule.default;
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.94,
  });
  const blob = Array.isArray(converted) ? converted[0] : converted;
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
    type: "image/jpeg",
  });
}

async function encodeCanvas(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (b) => resolve(b),
      mime,
      mime === "image/png" ? undefined : quality
    );
  });
}

async function convertSingleFile(
  originalFile: File,
  target: TargetFormat,
  qualityPct: number
): Promise<Omit<ConvertedItem, "id" | "file">> {
  const normalized = await normalizeInputFile(originalFile);
  const img = await loadImageFromFile(normalized);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  // Fill white background only when targeting JPEG (no alpha channel)
  if (target === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  const q = qualityPct / 100;

  if (target === "auto-smallest") {
    const candidates = ["image/webp", "image/jpeg", "image/png"];
    let bestBlob: Blob | null = null;
    let bestMime = "image/webp";

    for (const mime of candidates) {
      const b = await encodeCanvas(canvas, mime, q);
      if (b && b.type === mime && (!bestBlob || b.size < bestBlob.size)) {
        bestBlob = b;
        bestMime = mime;
      }
    }

    if (!bestBlob) throw new Error("Conversion failed");
    return {
      outputUrl: URL.createObjectURL(bestBlob),
      outputSize: bestBlob.size,
      outputMime: bestMime,
      width: canvas.width,
      height: canvas.height,
    };
  }

  let blob = await encodeCanvas(canvas, target, q);
  let actualMime: string = target;
  let fallbackNote: string | undefined;

  // Some browsers do not support AVIF canvas encoding and silently fall back to PNG
  if (target === "image/avif" && (!blob || blob.type !== "image/avif")) {
    blob = await encodeCanvas(canvas, "image/webp", q);
    actualMime = "image/webp";
    fallbackNote = "Browser fell back to WebP (AVIF encoding unsupported in this browser)";
  }

  if (!blob) throw new Error("Conversion failed");

  return {
    outputUrl: URL.createObjectURL(blob),
    outputSize: blob.size,
    outputMime: actualMime,
    width: canvas.width,
    height: canvas.height,
    fallbackNote,
  };
}

export default function ImageConverterTool() {
  const [target, setTarget] = useState<TargetFormat>("auto-smallest");
  const [quality, setQuality] = useState(82);
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFiles = async (files: File[]) => {
    setErrorMsg("");
    setProcessing(true);
    try {
      const next: ConvertedItem[] = [];
      for (const file of files) {
        const res = await convertSingleFile(file, target, quality);
        next.push({
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
          file,
          ...res,
        });
      }
      setItems((prev) => [...prev, ...next]);
    } catch {
      setErrorMsg(
        "Could not convert one of the files. Please make sure it is a valid JPG, PNG, WebP, AVIF, or HEIC image."
      );
    } finally {
      setProcessing(false);
    }
  };

  const reconvertAll = async () => {
    if (items.length === 0) return;
    setErrorMsg("");
    setProcessing(true);
    try {
      const updated = await Promise.all(
        items.map(async (item) => {
          URL.revokeObjectURL(item.outputUrl);
          const res = await convertSingleFile(item.file, target, quality);
          return { ...item, ...res };
        })
      );
      setItems(updated);
    } catch {
      setErrorMsg("Conversion failed while applying new settings.");
    } finally {
      setProcessing(false);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) URL.revokeObjectURL(found.outputUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.outputUrl));
    setItems([]);
  };

  useEffect(() => {
    return () => {
      items.forEach((i) => URL.revokeObjectURL(i.outputUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Convert To Format
            </label>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTarget(opt.id)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                    target === opt.id
                      ? "border-sky-600 bg-sky-50 text-sky-900 shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 text-sm font-bold">
                    {opt.id === "auto-smallest" && (
                      <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                    )}
                    {opt.label}
                  </span>
                  <span className="mt-0.5 text-xs text-slate-500">
                    {opt.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {target !== "image/png" && (
            <div className="max-w-md">
              <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
                <span>Output Quality</span>
                <span className="font-semibold text-sky-600">{quality}%</span>
              </div>
              <input
                type="range"
                min={30}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>
          )}

          {items.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={reconvertAll}
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${processing ? "animate-spin" : ""}`}
                />
                Apply New Format
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
      </div>

      <Dropzone
        accept="image/jpeg,image/png,image/webp,image/avif,.heic,.heif"
        multiple
        label="Drop JPG, PNG, WebP, AVIF, or iPhone HEIC files here"
        sublabel="Batch conversion — runs 100% locally in your browser with zero uploads"
        onFilesSelected={handleFiles}
      />

      {processing && (
        <p className="text-center text-sm font-medium text-sky-600">
          Converting images locally...
        </p>
      )}

      {errorMsg && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </p>
      )}

      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => {
            const base = item.file.name.replace(/\.[^/.]+$/, "");
            const ext = mimeToExt(item.outputMime);
            const savedPct = Math.round(
              ((item.file.size - item.outputSize) / item.file.size) * 100
            );

            return (
              <div
                key={item.id}
                className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.outputUrl}
                    alt={item.file.name}
                    className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                  />
                  <div>
                    <p className="max-w-xs truncate text-sm font-semibold text-slate-900">
                      {base}.{ext}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.width} × {item.height}px &middot;{" "}
                      {formatBytes(item.file.size)} &rarr;{" "}
                      <span className="font-semibold text-slate-900">
                        {formatBytes(item.outputSize)}
                      </span>
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {mimeToLabel(item.outputMime)}
                      </span>
                      {savedPct > 0 && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          {savedPct}% smaller
                        </span>
                      )}
                    </div>
                    {item.fallbackNote && (
                      <p className="mt-1 text-xs text-amber-600">
                        {item.fallbackNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                  <a
                    href={item.outputUrl}
                    download={`${base}.${ext}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
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
