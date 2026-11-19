"use client";

import { useState, useEffect } from "react";
import { Download, Sparkles, RotateCcw, Upload } from "lucide-react";
import Dropzone from "@/components/Dropzone";
import {
  enhanceImage,
  formatBytes,
  loadImageFromFile,
} from "@/lib/image-utils";

export default function ImageEnhancerTool() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [enhancedUrl, setEnhancedUrl] = useState<string>("");
  const [enhancedSize, setEnhancedSize] = useState<number>(0);
  const [outputDims, setOutputDims] = useState<{ w: number; h: number } | null>(
    null
  );

  const [scale, setScale] = useState<1 | 1.5 | 2>(1);
  const [sharpness, setSharpness] = useState(35);
  const [contrast, setContrast] = useState(10);
  const [brightness, setBrightness] = useState(5);
  const [saturation, setSaturation] = useState(10);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/jpeg");

  const [comparePos, setComparePos] = useState(50);
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (enhancedUrl) URL.revokeObjectURL(enhancedUrl);

    const img = await loadImageFromFile(file);
    setSourceFile(file);
    setSourceImg(img);
    setOriginalUrl(URL.createObjectURL(file));
    setEnhancedUrl("");
  };

  const runEnhancement = async () => {
    if (!sourceImg) return;
    setProcessing(true);
    try {
      const res = await enhanceImage(sourceImg, {
        scale,
        sharpness,
        contrast,
        brightness,
        saturation,
        format,
      });
      if (enhancedUrl) URL.revokeObjectURL(enhancedUrl);
      setEnhancedUrl(res.url);
      setEnhancedSize(res.blob.size);
      setOutputDims({ w: res.width, h: res.height });
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (sourceImg) {
      runEnhancement();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceImg, scale, sharpness, contrast, brightness, saturation, format]);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (enhancedUrl) URL.revokeObjectURL(enhancedUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyAutoPreset = () => {
    setScale(1.5);
    setSharpness(45);
    setContrast(14);
    setBrightness(6);
    setSaturation(14);
  };

  const resetAdjustments = () => {
    setScale(1);
    setSharpness(0);
    setContrast(0);
    setBrightness(0);
    setSaturation(0);
  };

  const getDownloadFilename = () => {
    if (!sourceFile) return "enhanced-image.jpg";
    const base = sourceFile.name.replace(/\.[^/.]+$/, "");
    return `${base}-enhanced.${format === "image/png" ? "png" : "jpg"}`;
  };

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Dropzone
          label="Drop an image here to enhance its quality"
          sublabel="Sharpen details, boost clarity, and upscale up to 2x — 100% private"
          onFilesSelected={handleFileSelect}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Enhancement Controls
              </h2>
              <button
                type="button"
                onClick={applyAutoPreset}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Auto Enhance
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Resolution Upscale
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([1, 1.5, 2] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScale(s)}
                    className={`rounded-lg border py-2 text-xs font-semibold transition-colors ${
                      scale === s
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {s}x {s === 1 ? "(Original)" : s === 1.5 ? "(HD)" : "(Ultra)"}
                  </button>
                ))}
              </div>
            </div>

            <SliderControl
              label="Sharpness / Clarity"
              value={sharpness}
              min={0}
              max={100}
              suffix="%"
              onChange={setSharpness}
            />
            <SliderControl
              label="Contrast"
              value={contrast}
              min={-40}
              max={40}
              onChange={setContrast}
            />
            <SliderControl
              label="Brightness"
              value={brightness}
              min={-40}
              max={40}
              onChange={setBrightness}
            />
            <SliderControl
              label="Color Vibrance"
              value={saturation}
              min={-40}
              max={40}
              onChange={setSaturation}
            />

            <div>
              <label
                htmlFor="enhance-format"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Download Format
              </label>
              <select
                id="enhance-format"
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as "image/png" | "image/jpeg")
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
              >
                <option value="image/jpeg">High-Quality JPEG</option>
                <option value="image/png">Lossless PNG</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
              {enhancedUrl && (
                <a
                  href={enhancedUrl}
                  download={getDownloadFilename()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" />
                  Download Enhanced Image
                </a>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={resetAdjustments}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
                <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Upload className="h-3.5 w-3.5" />
                  New Image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileSelect(Array.from(e.target.files));
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">
                Before / After Comparison
              </span>
              {outputDims && (
                <span>
                  Output: <strong>{outputDims.w} × {outputDims.h}px</strong>{" "}
                  ({formatBytes(enhancedSize)})
                </span>
              )}
            </div>

            <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {enhancedUrl ? (
                <div className="relative w-full select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={enhancedUrl}
                    alt="Enhanced preview"
                    className="block max-h-[480px] w-full object-contain"
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - comparePos}% 0 0)` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={originalUrl}
                      alt="Original preview"
                      className="block max-h-[480px] w-full object-contain"
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_6px_rgba(0,0,0,0.5)]"
                    style={{ left: `${comparePos}%` }}
                  />
                  <span className="pointer-events-none absolute left-3 top-3 rounded bg-slate-900/75 px-2 py-0.5 text-xs font-medium text-white">
                    Before
                  </span>
                  <span className="pointer-events-none absolute right-3 top-3 rounded bg-indigo-600/90 px-2 py-0.5 text-xs font-medium text-white">
                    After
                  </span>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  {processing ? "Enhancing image..." : "Preparing preview..."}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="compare-slider"
                className="mb-1 block text-xs font-medium text-slate-500"
              >
                Slide to compare Original vs Enhanced
              </label>
              <input
                id="compare-slider"
                type="range"
                min={0}
                max={100}
                value={comparePos}
                onChange={(e) => setComparePos(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        <span className="font-semibold text-indigo-600">
          {value > 0 && min < 0 ? `+${value}` : value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-600"
      />
    </div>
  );
}
