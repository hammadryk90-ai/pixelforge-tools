"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Sliders,
  Type,
  Upload,
  RefreshCw,
} from "lucide-react";
import Dropzone from "@/components/Dropzone";
import { loadImageFromFile } from "@/lib/image-utils";

type EditorTab = "transform" | "adjust" | "text";
type AspectPreset = "original" | "1:1" | "16:9" | "4:5" | "4:3" | "3:4" | "35:45";
type TextPosition = "top" | "center" | "bottom";
type ExportFormat = "image/jpeg" | "image/png" | "image/webp";

interface FilterPreset {
  id: string;
  label: string;
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  hue: number;
}

const FILTER_PRESETS: FilterPreset[] = [
  { id: "original", label: "Original", brightness: 0, contrast: 0, saturation: 0, sepia: 0, hue: 0 },
  { id: "vivid", label: "Vivid", brightness: 5, contrast: 15, saturation: 35, sepia: 0, hue: 0 },
  { id: "warm", label: "Warm", brightness: 4, contrast: 8, saturation: 15, sepia: 25, hue: 0 },
  { id: "cool", label: "Cool", brightness: 2, contrast: 10, saturation: 10, sepia: 0, hue: 15 },
  { id: "bw", label: "B&W", brightness: 5, contrast: 20, saturation: -100, sepia: 0, hue: 0 },
  { id: "vintage", label: "Vintage", brightness: -4, contrast: 10, saturation: -25, sepia: 45, hue: 0 },
  { id: "cinematic", label: "Cinematic", brightness: -5, contrast: 24, saturation: -10, sepia: 10, hue: -8 },
];

const ASPECT_PRESETS: { id: AspectPreset; label: string; ratio?: number }[] = [
  { id: "original", label: "Original" },
  { id: "1:1", label: "1:1 Square", ratio: 1 },
  { id: "16:9", label: "16:9 YouTube", ratio: 16 / 9 },
  { id: "4:5", label: "4:5 Instagram", ratio: 4 / 5 },
  { id: "4:3", label: "4:3 Classic", ratio: 4 / 3 },
  { id: "3:4", label: "3:4 Portrait", ratio: 3 / 4 },
  { id: "35:45", label: "Passport", ratio: 35 / 45 },
];

export default function PhotoEditorTool() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>("transform");

  // Transform state
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspect, setAspect] = useState<AspectPreset>("original");
  const [customWidth, setCustomWidth] = useState<number>(0);

  // Filter & Adjust state
  const [activePreset, setActivePreset] = useState("original");
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [hue, setHue] = useState(0);
  const [blur, setBlur] = useState(0);

  // Text overlay state
  const [overlayText, setOverlayText] = useState("");
  const [textSize, setTextSize] = useState(48);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textPos, setTextPos] = useState<TextPosition>("bottom");
  const [textOpacity, setTextOpacity] = useState(95);
  const [textShadow, setTextShadow] = useState(true);

  // Export state
  const [exportFormat, setExportFormat] = useState<ExportFormat>("image/jpeg");
  const [outputDims, setOutputDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resetAll = useCallback((img?: HTMLImageElement | null) => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspect("original");
    setCustomWidth(img ? img.naturalWidth : 0);
    setActivePreset("original");
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setSepia(0);
    setHue(0);
    setBlur(0);
    setOverlayText("");
    setTextSize(48);
    setTextColor("#ffffff");
    setTextPos("bottom");
    setTextOpacity(95);
    setTextShadow(true);
  }, []);

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const img = await loadImageFromFile(file);
    setSourceFile(file);
    setSourceImg(img);
    resetAll(img);
  };

  const applyPreset = (preset: FilterPreset) => {
    setActivePreset(preset.id);
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setSepia(preset.sepia);
    setHue(preset.hue);
  };

  // Render live canvas whenever any edit control changes
  useEffect(() => {
    if (!sourceImg || !canvasRef.current) return;

    const isRotated90 = rotation % 180 !== 0;
    const baseW = isRotated90 ? sourceImg.naturalHeight : sourceImg.naturalWidth;
    const baseH = isRotated90 ? sourceImg.naturalWidth : sourceImg.naturalHeight;

    // First draw rotated/flipped image to an offscreen canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = baseW;
    tempCanvas.height = baseH;
    const tCtx = tempCanvas.getContext("2d");
    if (!tCtx) return;

    tCtx.save();
    tCtx.translate(baseW / 2, baseH / 2);
    tCtx.rotate((rotation * Math.PI) / 180);
    tCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    tCtx.drawImage(
      sourceImg,
      -sourceImg.naturalWidth / 2,
      -sourceImg.naturalHeight / 2
    );
    tCtx.restore();

    // Calculate centered crop box for selected aspect ratio
    let cropW = baseW;
    let cropH = baseH;
    const presetObj = ASPECT_PRESETS.find((p) => p.id === aspect);
    if (presetObj?.ratio) {
      const currentRatio = baseW / baseH;
      if (currentRatio > presetObj.ratio) {
        cropW = Math.round(baseH * presetObj.ratio);
      } else {
        cropH = Math.round(baseW / presetObj.ratio);
      }
    }
    const cropX = Math.round((baseW - cropW) / 2);
    const cropY = Math.round((baseH - cropH) / 2);

    // Final output dimensions
    let outW = cropW;
    let outH = cropH;
    if (customWidth > 0 && customWidth !== cropW) {
      const clampedW = Math.max(50, Math.min(6000, customWidth));
      outW = clampedW;
      outH = Math.max(50, Math.round((cropH / cropW) * clampedW));
    }

    const canvas = canvasRef.current;
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%) sepia(${sepia}%) hue-rotate(${hue}deg) blur(${blur}px)`;
    ctx.drawImage(tempCanvas, cropX, cropY, cropW, cropH, 0, 0, outW, outH);
    ctx.filter = "none";

    // Draw optional text overlay
    if (overlayText.trim()) {
      const scaledFontSize = Math.max(14, Math.round((textSize / 800) * outW));
      ctx.save();
      ctx.globalAlpha = textOpacity / 100;
      ctx.font = `700 ${scaledFontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (textShadow) {
        ctx.shadowColor = "rgba(0,0,0,0.65)";
        ctx.shadowBlur = Math.max(4, scaledFontSize * 0.16);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = Math.max(2, scaledFontSize * 0.06);
      }

      const x = outW / 2;
      const y =
        textPos === "top"
          ? Math.max(scaledFontSize, outH * 0.1)
          : textPos === "center"
            ? outH / 2
            : outH - Math.max(scaledFontSize, outH * 0.1);

      ctx.fillText(overlayText, x, y, outW * 0.9);
      ctx.restore();
    }

    setOutputDims({ w: outW, h: outH });
  }, [
    sourceImg,
    rotation,
    flipH,
    flipV,
    aspect,
    customWidth,
    brightness,
    contrast,
    saturation,
    sepia,
    hue,
    blur,
    overlayText,
    textSize,
    textColor,
    textPos,
    textOpacity,
    textShadow,
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceFile) return;

    const ext =
      exportFormat === "image/png"
        ? "png"
        : exportFormat === "image/webp"
          ? "webp"
          : "jpg";
    const base = sourceFile.name.replace(/\.[^/.]+$/, "");

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${base}-edited.${ext}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      exportFormat,
      exportFormat === "image/png" ? undefined : 0.92
    );
  };

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Dropzone
          label="Drop a photo here to start editing"
          sublabel="Crop, rotate, resize, apply filters, and add text — 100% private in your browser"
          onFilesSelected={handleFileSelect}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls Sidebar */}
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("transform")}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                  activeTab === "transform"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Crop className="h-3.5 w-3.5" />
                Transform
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("adjust")}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                  activeTab === "adjust"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                Filters
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                  activeTab === "text"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Type className="h-3.5 w-3.5" />
                Text
              </button>
            </div>

            {activeTab === "transform" && (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Rotate &amp; Flip
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 270) % 360)}
                      className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      -90°
                    </button>
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <RotateCw className="h-4 w-4" />
                      +90°
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipH((f) => !f)}
                      className={`flex flex-col items-center gap-1 rounded-lg border py-2 text-xs font-medium ${
                        flipH
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <FlipHorizontal className="h-4 w-4" />
                      Flip H
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipV((f) => !f)}
                      className={`flex flex-col items-center gap-1 rounded-lg border py-2 text-xs font-medium ${
                        flipV
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <FlipVertical className="h-4 w-4" />
                      Flip V
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Crop Aspect Ratio
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ASPECT_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setAspect(p.id)}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                          aspect === p.id
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="editor-width"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Resize Width (px) — Height adjusts automatically
                  </label>
                  <input
                    id="editor-width"
                    type="number"
                    min={50}
                    max={6000}
                    value={customWidth || outputDims.w}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>
            )}

            {activeTab === "adjust" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    One-Click Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          activePreset === preset.id
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <SliderRow label="Brightness" value={brightness} min={-50} max={50} onChange={(v) => { setActivePreset("custom"); setBrightness(v); }} />
                <SliderRow label="Contrast" value={contrast} min={-50} max={50} onChange={(v) => { setActivePreset("custom"); setContrast(v); }} />
                <SliderRow label="Saturation" value={saturation} min={-100} max={100} onChange={(v) => { setActivePreset("custom"); setSaturation(v); }} />
                <SliderRow label="Blur" value={blur} min={0} max={10} suffix="px" onChange={(v) => { setActivePreset("custom"); setBlur(v); }} />
              </div>
            )}

            {activeTab === "text" && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="overlay-text"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Text / Watermark
                  </label>
                  <input
                    id="overlay-text"
                    type="text"
                    value={overlayText}
                    onChange={(e) => setOverlayText(e.target.value)}
                    placeholder="Type text to place on photo..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                  />
                </div>

                <SliderRow label="Font Size" value={textSize} min={16} max={120} suffix="px" onChange={setTextSize} />
                <SliderRow label="Opacity" value={textOpacity} min={20} max={100} suffix="%" onChange={setTextOpacity} />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Position
                    </label>
                    <select
                      value={textPos}
                      onChange={(e) => setTextPos(e.target.value as TextPosition)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                    >
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-9 w-12 cursor-pointer rounded border border-slate-300"
                      />
                      <span className="text-xs font-mono text-slate-500">{textColor}</span>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={textShadow}
                    onChange={(e) => setTextShadow(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  Add subtle drop shadow for readability
                </label>
              </div>
            )}

            {/* Export Controls */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div>
                <label
                  htmlFor="editor-export-format"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Export Format
                </label>
                <select
                  id="editor-export-format"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                >
                  <option value="image/jpeg">JPEG (Best for photos)</option>
                  <option value="image/png">PNG (Lossless quality)</option>
                  <option value="image/webp">WebP (Smallest for web)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Download className="h-4 w-4" />
                Download Edited Photo
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => resetAll(sourceImg)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset Edits
                </button>
                <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Upload className="h-3.5 w-3.5" />
                  New Photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileSelect(Array.from(e.target.files));
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Live Canvas Preview */}
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">Live Preview</span>
              <span>
                Output: <strong>{outputDims.w} × {outputDims.h}px</strong>
              </span>
            </div>
            <div className="flex min-h-[340px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2">
              <canvas
                ref={canvasRef}
                className="max-h-[520px] max-w-full rounded object-contain shadow-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SliderRow({
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
