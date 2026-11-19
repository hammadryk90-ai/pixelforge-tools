export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}

export type OutputFormat = "original" | "image/webp" | "image/jpeg" | "image/png";

export interface CompressOptions {
  quality: number; // 0.1 to 1.0
  maxWidth: number; // 0 means keep original
  format: OutputFormat;
}

export interface CompressResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  mimeType: string;
}

export async function compressImage(
  file: File,
  options: CompressOptions
): Promise<CompressResult> {
  const img = await loadImageFromFile(file);
  let targetWidth = img.naturalWidth;
  let targetHeight = img.naturalHeight;

  if (options.maxWidth > 0 && targetWidth > options.maxWidth) {
    const ratio = options.maxWidth / targetWidth;
    targetWidth = options.maxWidth;
    targetHeight = Math.round(targetHeight * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const mimeType =
    options.format === "original"
      ? file.type === "image/png" || file.type === "image/webp"
        ? file.type
        : "image/jpeg"
      : options.format;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) reject(new Error("Compression failed"));
        else resolve(result);
      },
      mimeType,
      mimeType === "image/png" ? undefined : options.quality
    );
  });

  return {
    blob,
    url: URL.createObjectURL(blob),
    width: targetWidth,
    height: targetHeight,
    mimeType,
  };
}

export interface EnhanceOptions {
  scale: 1 | 1.5 | 2;
  sharpness: number; // 0 to 100
  contrast: number; // -50 to 50
  brightness: number; // -50 to 50
  saturation: number; // -50 to 50
  format: "image/png" | "image/jpeg";
}

/**
 * Applies a 3x3 sharpening convolution kernel blended by `amount` (0..1).
 */
function applySharpen(
  imageData: ImageData,
  amount: number
): ImageData {
  if (amount <= 0) return imageData;
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data.length);

  // Center weight 1 + 4*amount, orthogonal neighbors -amount
  const center = 1 + 4 * amount;
  const side = -amount;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        output[idx] = data[idx];
        output[idx + 1] = data[idx + 1];
        output[idx + 2] = data[idx + 2];
        output[idx + 3] = data[idx + 3];
        continue;
      }

      const up = ((y - 1) * width + x) * 4;
      const down = ((y + 1) * width + x) * 4;
      const left = (y * width + (x - 1)) * 4;
      const right = (y * width + (x + 1)) * 4;

      for (let c = 0; c < 3; c++) {
        const val =
          data[idx + c] * center +
          (data[up + c] + data[down + c] + data[left + c] + data[right + c]) *
            side;
        output[idx + c] = Math.max(0, Math.min(255, val));
      }
      output[idx + 3] = data[idx + 3];
    }
  }

  return new ImageData(output, width, height);
}

export async function enhanceImage(
  img: HTMLImageElement,
  options: EnhanceOptions
): Promise<{ blob: Blob; url: string; width: number; height: number }> {
  const targetWidth = Math.round(img.naturalWidth * options.scale);
  const targetHeight = Math.round(img.naturalHeight * options.scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Use CSS filter on canvas context for hardware-accelerated tone adjustments
  const brightnessPct = 100 + options.brightness;
  const contrastPct = 100 + options.contrast;
  const saturatePct = 100 + options.saturation;
  ctx.filter = `brightness(${brightnessPct}%) contrast(${contrastPct}%) saturate(${saturatePct}%)`;

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  ctx.filter = "none";

  if (options.sharpness > 0) {
    const raw = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const sharpened = applySharpen(raw, (options.sharpness / 100) * 0.85);
    ctx.putImageData(sharpened, 0, 0);
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) reject(new Error("Enhancement failed"));
        else resolve(result);
      },
      options.format,
      options.format === "image/jpeg" ? 0.94 : undefined
    );
  });

  return {
    blob,
    url: URL.createObjectURL(blob),
    width: targetWidth,
    height: targetHeight,
  };
}

export async function compressToTargetKb(
  file: File,
  targetKb: number,
  format: "image/jpeg" | "image/webp" = "image/jpeg"
): Promise<CompressResult> {
  const img = await loadImageFromFile(file);
  const targetBytes = Math.max(5, targetKb) * 1024;

  let scale = 1;
  let bestBlob: Blob | null = null;
  let bestW = img.naturalWidth;
  let bestH = img.naturalHeight;

  const renderAt = (w: number, h: number, q: number): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context is not available");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Compression failed"))),
        format,
        q
      );
    });
  };

  for (let attempt = 0; attempt < 5; attempt++) {
    const w = Math.max(100, Math.round(img.naturalWidth * scale));
    const h = Math.max(100, Math.round(img.naturalHeight * scale));

    let low = 0.08;
    let high = 0.95;
    let candidate: Blob | null = null;

    for (let i = 0; i < 7; i++) {
      const mid = (low + high) / 2;
      const blob = await renderAt(w, h, mid);
      if (blob.size <= targetBytes) {
        candidate = blob;
        low = mid;
      } else {
        high = mid;
      }
    }

    if (candidate) {
      bestBlob = candidate;
      bestW = w;
      bestH = h;
      break;
    }

    // Even at low quality it exceeded targetBytes; downscale and retry
    bestBlob = await renderAt(w, h, 0.08);
    bestW = w;
    bestH = h;
    scale *= 0.72;
  }

  if (!bestBlob) throw new Error("Unable to compress image to target size");

  return {
    blob: bestBlob,
    url: URL.createObjectURL(bestBlob),
    width: bestW,
    height: bestH,
    mimeType: format,
  };
}
