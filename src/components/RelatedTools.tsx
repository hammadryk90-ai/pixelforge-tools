import Link from "next/link";
import {
  Minimize2,
  ArrowLeftRight,
  Gauge,
  SlidersHorizontal,
  Sparkles,
  FileText,
  Files,
  QrCode,
  Pipette,
  ArrowRight,
} from "lucide-react";

const ALL_TOOLS = [
  {
    href: "/compress-image",
    title: "Image Compressor",
    desc: "Shrink JPG, PNG & WebP up to 80%.",
    icon: Minimize2,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    href: "/compress-to-kb",
    title: "Compress to Exact KB",
    desc: "Hit 20KB, 50KB, 100KB, or 200KB.",
    icon: Gauge,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    href: "/convert-image",
    title: "Format Converter",
    desc: "HEIC to JPG, WebP, AVIF & PNG.",
    icon: ArrowLeftRight,
    color: "bg-sky-100 text-sky-600",
  },
  {
    href: "/photo-editor",
    title: "Online Photo Editor",
    desc: "Crop, rotate, filters & watermarks.",
    icon: SlidersHorizontal,
    color: "bg-rose-100 text-rose-600",
  },
  {
    href: "/enhance-image",
    title: "Quality Enhancer",
    desc: "Sharpen blurry photos & upscale 2x.",
    icon: Sparkles,
    color: "bg-amber-100 text-amber-600",
  },
  {
    href: "/image-to-pdf",
    title: "Image to PDF",
    desc: "Combine photos into A4/Letter PDF.",
    icon: FileText,
    color: "bg-violet-100 text-violet-600",
  },
  {
    href: "/pdf-tools",
    title: "PDF Toolkit",
    desc: "Merge, split, watermark & number PDFs.",
    icon: Files,
    color: "bg-teal-100 text-teal-600",
  },
  {
    href: "/qr-generator",
    title: "QR Code Generator",
    desc: "Static URL, WiFi & email QR codes.",
    icon: QrCode,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    href: "/color-picker",
    title: "Color Picker & CSS",
    desc: "Pick HEX/RGB/HSL & build gradients.",
    icon: Pipette,
    color: "bg-fuchsia-100 text-fuchsia-600",
  },
];

export default function RelatedTools({ currentPath }: { currentPath: string }) {
  const others = ALL_TOOLS.filter((t) => t.href !== currentPath).slice(0, 4);

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          More Free Privacy-First Tools
        </h2>
        <Link
          href="/"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all 9 tools &rarr;
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {others.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
            >
              <div>
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tool.color}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-slate-900">
                  {tool.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600">{tool.desc}</p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                Try now
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
