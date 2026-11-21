"use client";

import { useState, useRef } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import {
  FilePlus2,
  Scissors,
  Stamp,
  Hash,
  UploadCloud,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
} from "lucide-react";
import { formatBytes } from "@/lib/image-utils";

type PdfTab = "merge" | "split" | "watermark" | "numbers";

function downloadPdfBytes(bytes: Uint8Array, filename: string) {
  const safeBytes = new Uint8Array(bytes);
  const blob = new Blob([safeBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Parses page ranges like "1-3, 5, 7-8" into 0-based page indices.
 */
function parsePageRanges(input: string, maxPages: number): number[] {
  const indices = new Set<number>();
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(maxPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) indices.add(i - 1);
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num >= 1 && num <= maxPages) {
        indices.add(num - 1);
      }
    }
  }
  return Array.from(indices).sort((a, b) => a - b);
}

export default function PdfToolkitTool() {
  const [activeTab, setActiveTab] = useState<PdfTab>("merge");
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const mergeInputRef = useRef<HTMLInputElement>(null);

  // Single-PDF state (shared for Split, Watermark, Page Numbers)
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [singlePageCount, setSinglePageCount] = useState<number>(0);
  const singleInputRef = useRef<HTMLInputElement>(null);

  // Split options
  const [pageRange, setPageRange] = useState("1-2");

  // Watermark options
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(25);
  const [watermarkSize, setWatermarkSize] = useState(48);

  // Page numbers options
  const [numberFormat, setNumberFormat] = useState<"plain" | "of" | "page">("of");
  const [numberPosition, setNumberPosition] = useState<"center" | "right">("center");

  const clearFeedback = () => {
    setStatusMsg("");
    setErrorMsg("");
  };

  const handleSelectSinglePdf = async (file: File | undefined) => {
    clearFeedback();
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      const count = doc.getPageCount();
      setSingleFile(file);
      setSinglePageCount(count);
      setPageRange(count > 1 ? `1-${Math.min(2, count)}` : "1");
    } catch {
      setErrorMsg("Could not read this PDF. Make sure it is not password-protected.");
    }
  };

  const handleMerge = async () => {
    clearFeedback();
    if (mergeFiles.length < 2) {
      setErrorMsg("Please select at least 2 PDF files to merge.");
      return;
    }
    setBusy(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of mergeFiles) {
        const buf = await file.arrayBuffer();
        const src = await PDFDocument.load(buf);
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      downloadPdfBytes(out, "merged-document.pdf");
      setStatusMsg(`Merged ${mergeFiles.length} PDFs (${merged.getPageCount()} pages total).`);
    } catch {
      setErrorMsg("Failed to merge PDFs. Encrypted or corrupted PDFs cannot be merged.");
    } finally {
      setBusy(false);
    }
  };

  const handleSplit = async () => {
    clearFeedback();
    if (!singleFile) return;
    const indices = parsePageRanges(pageRange, singlePageCount);
    if (indices.length === 0) {
      setErrorMsg(`Enter a valid page range between 1 and ${singlePageCount} (e.g. 1-3, 5).`);
      return;
    }
    setBusy(true);
    try {
      const buf = await singleFile.arrayBuffer();
      const src = await PDFDocument.load(buf);
      const outDoc = await PDFDocument.create();
      const copied = await outDoc.copyPages(src, indices);
      copied.forEach((p) => outDoc.addPage(p));
      const out = await outDoc.save();
      const base = singleFile.name.replace(/\.pdf$/i, "");
      downloadPdfBytes(out, `${base}-extracted.pdf`);
      setStatusMsg(`Extracted ${indices.length} page(s) into a new PDF.`);
    } catch {
      setErrorMsg("Failed to split this PDF.");
    } finally {
      setBusy(false);
    }
  };

  const handleWatermark = async () => {
    clearFeedback();
    if (!singleFile || !watermarkText.trim()) {
      setErrorMsg("Please upload a PDF and enter watermark text.");
      return;
    }
    setBusy(true);
    try {
      const buf = await singleFile.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, watermarkSize);
        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2.6,
          y: height / 2 - watermarkSize / 2,
          size: watermarkSize,
          font,
          color: rgb(0.35, 0.35, 0.45),
          opacity: watermarkOpacity / 100,
          rotate: degrees(35),
        });
      }

      const out = await doc.save();
      const base = singleFile.name.replace(/\.pdf$/i, "");
      downloadPdfBytes(out, `${base}-watermarked.pdf`);
      setStatusMsg(`Added watermark to ${pages.length} page(s).`);
    } catch {
      setErrorMsg("Failed to add watermark to this PDF.");
    } finally {
      setBusy(false);
    }
  };

  const handlePageNumbers = async () => {
    clearFeedback();
    if (!singleFile) return;
    setBusy(true);
    try {
      const buf = await singleFile.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;

      pages.forEach((page, idx) => {
        const num = idx + 1;
        const label =
          numberFormat === "of"
            ? `${num} / ${total}`
            : numberFormat === "page"
              ? `Page ${num}`
              : `${num}`;
        const fontSize = 11;
        const textWidth = font.widthOfTextAtSize(label, fontSize);
        const { width } = page.getSize();
        const x =
          numberPosition === "center"
            ? (width - textWidth) / 2
            : width - textWidth - 28;

        page.drawText(label, {
          x,
          y: 18,
          size: fontSize,
          font,
          color: rgb(0.25, 0.28, 0.35),
        });
      });

      const out = await doc.save();
      const base = singleFile.name.replace(/\.pdf$/i, "");
      downloadPdfBytes(out, `${base}-numbered.pdf`);
      setStatusMsg(`Added page numbers to ${total} page(s).`);
    } catch {
      setErrorMsg("Failed to add page numbers to this PDF.");
    } finally {
      setBusy(false);
    }
  };

  const moveMergeFile = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= mergeFiles.length) return;
    setMergeFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const tabs: { id: PdfTab; label: string; icon: typeof FilePlus2 }[] = [
    { id: "merge", label: "Merge PDF", icon: FilePlus2 },
    { id: "split", label: "Split / Extract", icon: Scissors },
    { id: "watermark", label: "Watermark PDF", icon: Stamp },
    { id: "numbers", label: "Page Numbers", icon: Hash },
  ];

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 sm:grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                clearFeedback();
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                active
                  ? "bg-white text-violet-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Merge Tab */}
      {activeTab === "merge" && (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div
            role="button"
            tabIndex={0}
            onClick={() => mergeInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                mergeInputRef.current?.click();
              }
            }}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center hover:border-violet-400 hover:bg-violet-50/30"
          >
            <input
              ref={mergeInputRef}
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setMergeFiles((prev) => [
                    ...prev,
                    ...Array.from(e.target.files!).filter(
                      (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name)
                    ),
                  ]);
                }
                e.target.value = "";
              }}
            />
            <UploadCloud className="mb-2 h-8 w-8 text-violet-600" />
            <p className="text-sm font-semibold text-slate-800">
              Click to select multiple PDF files to merge
            </p>
            <p className="mt-1 text-xs text-slate-500">
              100% private — PDFs are combined locally in your browser
            </p>
          </div>

          {mergeFiles.length > 0 && (
            <div className="space-y-3">
              {mergeFiles.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {idx + 1}. {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveMergeFile(idx, -1)}
                      disabled={idx === 0}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveMergeFile(idx, 1)}
                      disabled={idx === mergeFiles.length - 1}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setMergeFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMergeFiles([])}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={handleMerge}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  {busy ? "Merging..." : "Merge & Download PDF"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Single-PDF Tabs (Split, Watermark, Page Numbers) */}
      {activeTab !== "merge" && (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div
            role="button"
            tabIndex={0}
            onClick={() => singleInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                singleInputRef.current?.click();
              }
            }}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-7 text-center hover:border-violet-400 hover:bg-violet-50/30"
          >
            <input
              ref={singleInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                handleSelectSinglePdf(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <UploadCloud className="mb-2 h-8 w-8 text-violet-600" />
            <p className="text-sm font-semibold text-slate-800">
              {singleFile
                ? `${singleFile.name} (${singlePageCount} pages)`
                : "Click to choose a PDF file"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {singleFile
                ? "Click here to switch to a different PDF"
                : "Processed 100% locally — your document never leaves your device"}
            </p>
          </div>

          {singleFile && activeTab === "split" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="split-range"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Pages to Extract (Total pages: {singlePageCount})
                </label>
                <input
                  id="split-range"
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g. 1-3, 5"
                  className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Use commas and hyphens, e.g. <code>1-3, 5</code>
                </p>
              </div>
              <button
                type="button"
                onClick={handleSplit}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                <Download className="h-4 w-4" />
                {busy ? "Extracting..." : "Extract Pages to PDF"}
              </button>
            </div>
          )}

          {singleFile && activeTab === "watermark" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="wm-text"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Watermark Text
                  </label>
                  <input
                    id="wm-text"
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex justify-between text-sm font-medium text-slate-700">
                    <span>Font Size</span>
                    <span className="text-violet-600">{watermarkSize}pt</span>
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={80}
                    value={watermarkSize}
                    onChange={(e) => setWatermarkSize(Number(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex justify-between text-sm font-medium text-slate-700">
                    <span>Opacity</span>
                    <span className="text-violet-600">{watermarkOpacity}%</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={70}
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleWatermark}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                <Download className="h-4 w-4" />
                {busy ? "Applying..." : "Apply Watermark & Download"}
              </button>
            </div>
          )}

          {singleFile && activeTab === "numbers" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="num-format"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Number Format
                  </label>
                  <select
                    id="num-format"
                    value={numberFormat}
                    onChange={(e) =>
                      setNumberFormat(e.target.value as "plain" | "of" | "page")
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                  >
                    <option value="of">1 / {singlePageCount}</option>
                    <option value="page">Page 1</option>
                    <option value="plain">1</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="num-pos"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Footer Position
                  </label>
                  <select
                    id="num-pos"
                    value={numberPosition}
                    onChange={(e) =>
                      setNumberPosition(e.target.value as "center" | "right")
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                  >
                    <option value="center">Bottom Center</option>
                    <option value="right">Bottom Right</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePageNumbers}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                <Download className="h-4 w-4" />
                {busy ? "Numbering..." : "Add Page Numbers & Download"}
              </button>
            </div>
          )}
        </div>
      )}

      {statusMsg && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {statusMsg}
        </p>
      )}
      {errorMsg && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
