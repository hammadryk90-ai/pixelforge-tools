"use client";

import { useState, useRef } from "react";
import { Pipette, Palette, Copy, Check, Upload } from "lucide-react";
import Dropzone from "@/components/Dropzone";
import { loadImageFromFile } from "@/lib/image-utils";

type ColorTab = "picker" | "gradient";

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function rgbToHsl(r: number, g: number, b: number): string {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function extractPalette(canvas: HTMLCanvasElement, count = 6): string[] {
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  const sampleW = Math.min(120, canvas.width);
  const sampleH = Math.min(120, canvas.height);

  const tmp = document.createElement("canvas");
  tmp.width = sampleW;
  tmp.height = sampleH;
  const tCtx = tmp.getContext("2d");
  if (!tCtx) return [];
  tCtx.drawImage(canvas, 0, 0, sampleW, sampleH);
  const { data } = tCtx.getImageData(0, 0, sampleW, sampleH);

  // Quantize into 32-step color buckets and pick top distinct colors
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${Math.floor(r / 32)}-${Math.floor(g / 32)}-${Math.floor(b / 32)}`;
    const prev = buckets.get(key);
    if (prev) {
      prev.r += r;
      prev.g += g;
      prev.b += b;
      prev.n += 1;
    } else {
      buckets.set(key, { r, g, b, n: 1 });
    }
  }

  const sorted = Array.from(buckets.values()).sort((a, b) => b.n - a.n);
  const palette: string[] = [];
  for (const item of sorted) {
    if (palette.length >= count) break;
    palette.push(rgbToHex(item.r / item.n, item.g / item.n, item.b / item.n));
  }
  return palette;
}

export default function ColorPickerTool() {
  const [activeTab, setActiveTab] = useState<ColorTab>("picker");
  const [hasImage, setHasImage] = useState(false);
  const [picked, setPicked] = useState({ r: 79, g: 70, b: 229 });
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Gradient state
  const [gradStart, setGradStart] = useState("#4F46E5");
  const [gradEnd, setGradEnd] = useState("#0EA5E9");
  const [gradAngle, setGradAngle] = useState(135);

  const copyValue = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1500);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleImageSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const img = await loadImageFromFile(file);
    setHasImage(true);

    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const maxDim = 900;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxDim) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);

      // Sample center pixel as initial color
      const center = ctx.getImageData(Math.floor(w / 2), Math.floor(h / 2), 1, 1).data;
      setPicked({ r: center[0], g: center[1], b: center[2] });
      setPalette(extractPalette(canvas, 6));
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pixel = ctx.getImageData(
      Math.max(0, Math.min(canvas.width - 1, x)),
      Math.max(0, Math.min(canvas.height - 1, y)),
      1,
      1
    ).data;
    setPicked({ r: pixel[0], g: pixel[1], b: pixel[2] });
  };

  const hex = rgbToHex(picked.r, picked.g, picked.b);
  const rgbStr = `rgb(${picked.r}, ${picked.g}, ${picked.b})`;
  const hslStr = rgbToHsl(picked.r, picked.g, picked.b);
  const gradientCss = `background: linear-gradient(${gradAngle}deg, ${gradStart}, ${gradEnd});`;

  return (
    <div className="space-y-6">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("picker")}
          className={`inline-flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${
            activeTab === "picker"
              ? "bg-white text-fuchsia-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Pipette className="h-4 w-4" />
          Image Color Picker
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("gradient")}
          className={`inline-flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${
            activeTab === "gradient"
              ? "bg-white text-fuchsia-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Palette className="h-4 w-4" />
          CSS Gradient
        </button>
      </div>

      {activeTab === "picker" && (
        <div className="space-y-6">
          {!hasImage ? (
            <Dropzone
              label="Drop an image to pick colors & extract its palette"
              sublabel="Click any pixel to get HEX, RGB, and HSL codes — 100% locally in your browser"
              onFilesSelected={handleImageSelect}
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-7">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    Click anywhere on the image to pick a color
                  </span>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    <Upload className="h-3.5 w-3.5" />
                    New Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleImageSelect(Array.from(e.target.files));
                        }
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <div className="flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="max-h-[440px] max-w-full cursor-crosshair rounded object-contain"
                  />
                </div>
              </div>

              <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 shadow-inner"
                    style={{ backgroundColor: hex }}
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Selected Color
                    </p>
                    <p className="font-mono text-2xl font-extrabold text-slate-900">
                      {hex}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { key: "hex", label: "HEX", value: hex },
                    { key: "rgb", label: "RGB", value: rgbStr },
                    { key: "hsl", label: "HSL", value: hslStr },
                  ].map((row) => (
                    <div
                      key={row.key}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-slate-400">
                          {row.label}
                        </span>
                        <p className="font-mono text-sm font-semibold text-slate-800">
                          {row.value}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyValue(row.key, row.value)}
                        className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100"
                      >
                        {copiedKey === row.key ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {palette.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Extracted Palette (Click to Copy)
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {palette.map((col, idx) => (
                        <button
                          key={`${col}-${idx}`}
                          type="button"
                          onClick={() => copyValue(`pal-${idx}`, col)}
                          className="group flex flex-col items-center rounded-xl border border-slate-200 p-2 hover:border-fuchsia-400"
                        >
                          <span
                            className="h-9 w-full rounded-lg border border-black/5"
                            style={{ backgroundColor: col }}
                          />
                          <span className="mt-1.5 font-mono text-[11px] font-semibold text-slate-700">
                            {copiedKey === `pal-${idx}` ? "Copied!" : col}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "gradient" && (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div
            className="h-44 w-full rounded-2xl border border-slate-200 shadow-inner"
            style={{
              background: `linear-gradient(${gradAngle}deg, ${gradStart}, ${gradEnd})`,
            }}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Start Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradStart}
                  onChange={(e) => setGradStart(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded border border-slate-300"
                />
                <span className="font-mono text-sm text-slate-700">
                  {gradStart}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                End Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradEnd}
                  onChange={(e) => setGradEnd(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded border border-slate-300"
                />
                <span className="font-mono text-sm text-slate-700">
                  {gradEnd}
                </span>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex justify-between text-sm font-medium text-slate-700">
                <span>Angle</span>
                <span className="font-semibold text-fuchsia-600">
                  {gradAngle}°
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={gradAngle}
                onChange={(e) => setGradAngle(Number(e.target.value))}
                className="w-full accent-fuchsia-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <code className="text-xs font-semibold text-slate-800 sm:text-sm">
              {gradientCss}
            </code>
            <button
              type="button"
              onClick={() => copyValue("css-grad", gradientCss)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-fuchsia-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-fuchsia-700"
            >
              {copiedKey === "css-grad" ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied CSS
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy CSS
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
