"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import {
  FileDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
} from "lucide-react";
import Dropzone from "@/components/Dropzone";
import { formatBytes, loadImageFromFile } from "@/lib/image-utils";

interface PdfImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

type PageSizeOption = "a4" | "letter" | "fit";
type OrientationOption = "auto" | "portrait" | "landscape";
type MarginOption = "none" | "small" | "medium";

export default function ImageToPdfTool() {
  const [items, setItems] = useState<PdfImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeOption>("a4");
  const [orientation, setOrientation] = useState<OrientationOption>("auto");
  const [margin, setMargin] = useState<MarginOption>("small");
  const [pdfName, setPdfName] = useState("converted-images");
  const [generating, setGenerating] = useState(false);

  const addFiles = (files: File[]) => {
    const newItems = files.map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
  };

  useEffect(() => {
    return () => {
      items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePdf = async () => {
    if (items.length === 0) return;
    setGenerating(true);

    try {
      const marginMm = margin === "none" ? 0 : margin === "small" ? 10 : 20;
      let doc: jsPDF | null = null;

      for (let i = 0; i < items.length; i++) {
        const img = await loadImageFromFile(items[i].file);

        // Normalize image via canvas to JPEG data URL for reliable jsPDF embedding
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context unavailable");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

        const isImgLandscape = img.naturalWidth > img.naturalHeight;
        const pageOrientation: "p" | "l" =
          orientation === "auto"
            ? isImgLandscape
              ? "l"
              : "p"
            : orientation === "landscape"
              ? "l"
              : "p";

        if (pageSize === "fit") {
          // Convert px to mm at 96 DPI (1px = 0.264583 mm)
          const pxToMm = 0.264583;
          const pageW = img.naturalWidth * pxToMm + marginMm * 2;
          const pageH = img.naturalHeight * pxToMm + marginMm * 2;
          const formatArr: [number, number] = [pageW, pageH];

          if (!doc) {
            doc = new jsPDF({
              orientation: pageW > pageH ? "l" : "p",
              unit: "mm",
              format: formatArr,
            });
          } else {
            doc.addPage(formatArr, pageW > pageH ? "l" : "p");
          }

          doc.addImage(
            dataUrl,
            "JPEG",
            marginMm,
            marginMm,
            img.naturalWidth * pxToMm,
            img.naturalHeight * pxToMm
          );
        } else {
          if (!doc) {
            doc = new jsPDF({
              orientation: pageOrientation,
              unit: "mm",
              format: pageSize,
            });
          } else {
            doc.addPage(pageSize, pageOrientation);
          }

          const pageW = doc.internal.pageSize.getWidth();
          const pageH = doc.internal.pageSize.getHeight();
          const availW = pageW - marginMm * 2;
          const availH = pageH - marginMm * 2;

          const imgRatio = img.naturalWidth / img.naturalHeight;
          const boxRatio = availW / availH;

          let drawW = availW;
          let drawH = availH;
          if (imgRatio > boxRatio) {
            drawH = availW / imgRatio;
          } else {
            drawW = availH * imgRatio;
          }

          const x = marginMm + (availW - drawW) / 2;
          const y = marginMm + (availH - drawH) / 2;
          doc.addImage(dataUrl, "JPEG", x, y, drawW, drawH);
        }
      }

      if (doc) {
        const cleanName = (pdfName.trim() || "converted-images").replace(
          /\.pdf$/i,
          ""
        );
        doc.save(`${cleanName}.pdf`);
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="pdf-page-size"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Page Size
            </label>
            <select
              id="pdf-page-size"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            >
              <option value="a4">A4 (Standard)</option>
              <option value="letter">US Letter</option>
              <option value="fit">Fit to Image Size</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pdf-orientation"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Orientation
            </label>
            <select
              id="pdf-orientation"
              value={orientation}
              onChange={(e) =>
                setOrientation(e.target.value as OrientationOption)
              }
              disabled={pageSize === "fit"}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 disabled:bg-slate-100"
            >
              <option value="auto">Auto (Match Image)</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pdf-margin"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Page Margin
            </label>
            <select
              id="pdf-margin"
              value={margin}
              onChange={(e) => setMargin(e.target.value as MarginOption)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            >
              <option value="none">No Margin</option>
              <option value="small">Small (10mm)</option>
              <option value="medium">Medium (20mm)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pdf-filename"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              PDF File Name
            </label>
            <input
              id="pdf-filename"
              type="text"
              value={pdfName}
              onChange={(e) => setPdfName(e.target.value)}
              placeholder="converted-images"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            />
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <Dropzone
          multiple
          label="Drop images here to convert to PDF"
          sublabel="Select one or multiple JPG, PNG, or WebP files"
          onFilesSelected={addFiles}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-800">
              {items.length} {items.length === 1 ? "page" : "pages"} ready
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Plus className="h-4 w-4" />
                Add More
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      addFiles(Array.from(e.target.files));
                    }
                    e.target.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
              <button
                type="button"
                onClick={generatePdf}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                <FileDown className="h-4 w-4" />
                {generating ? "Creating PDF..." : "Download PDF"}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {idx + 1}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Move page up"
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    aria-label="Move page down"
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                    className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
