"use client";

import { useState, useEffect } from "react";
import { Download, CheckCircle2, Trash2, RefreshCw } from "lucide-react";
import Dropzone from "@/components/Dropzone";
import { compressToTargetKb, formatBytes } from "@/lib/image-utils";

interface TargetResult {
  file: File;
  url: string;
  size: number;
  width: number;
  height: number;
  mimeType: string;
}

const presetSizes = [20, 50, 100, 200, 500];

export default function ExactKbCompressorTool() {
  const [targetKb, setTargetKb] = useState(100);
  const [format, setFormat] = useState<"image/jpeg" | "image/webp">("image/jpeg");
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [result, setResult] = useState<TargetResult | null>(null);
  const [processing, setProcessing] = useState(false);

  const runCompression = async (
    file: File,
    kb: number,
    fmt: "image/jpeg" | "image/webp"
  ) => {
    setProcessing(true);
    try {
      const res = await compressToTargetKb(file, kb, fmt);
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return {
          file,
          url: res.url,
          size: res.blob.size,
          width: res.width,
          height: res.height,
          mimeType: res.mimeType,
        };
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setSourceFile(file);
    runCompression(file, targetKb, format);
  };

  const clear = () => {
    if (result) URL.revokeObjectURL(result.url);
    setSourceFile(null);
    setResult(null);
  };

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDownloadName = () => {
    if (!sourceFile) return "compressed.jpg";
    const base = sourceFile.name.replace(/\.[^/.]+$/, "");
    const ext = format === "image/webp" ? "webp" : "jpg";
    return `${base}-${targetKb}kb.${ext}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Target File Size (KB)
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {presetSizes.map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => setTargetKb(kb)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    targetKb === kb
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {kb} KB
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={10}
                max={5000}
                value={targetKb}
                onChange={(e) => setTargetKb(Math.max(10, Number(e.target.value)))}
                className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
              <span className="text-sm text-slate-500">KB (custom)</span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div>
              <label
                htmlFor="exact-kb-format"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Output Format
              </label>
              <select
                id="exact-kb-format"
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as "image/jpeg" | "image/webp")
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
              >
                <option value="image/jpeg">JPEG (Required by most portals)</option>
                <option value="image/webp">WebP (Sharper at small KB)</option>
              </select>
            </div>

            {sourceFile && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => runCompression(sourceFile, targetKb, format)}
                  disabled={processing}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${processing ? "animate-spin" : ""}`}
                  />
                  Re-compress to {targetKb} KB
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!sourceFile ? (
        <Dropzone
          label={`Drop an image to compress under ${targetKb} KB`}
          sublabel="Ideal for passport photos, visa applications, resumes, and job portals"
          onFilesSelected={handleFilesSelected}
        />
      ) : (
        result && (
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt={result.file.name}
                className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
              />
              <div>
                <p className="max-w-xs truncate text-sm font-bold text-slate-900">
                  {result.file.name}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {result.width} × {result.height}px &middot;{" "}
                  {formatBytes(result.file.size)} &rarr;{" "}
                  <strong className="text-slate-900">
                    {formatBytes(result.size)}
                  </strong>
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Ready under {targetKb} KB
                </span>
              </div>
            </div>

            <a
              href={result.url}
              download={getDownloadName()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Download className="h-4 w-4" />
              Download Image
            </a>
          </div>
        )
      )}
    </div>
  );
}
