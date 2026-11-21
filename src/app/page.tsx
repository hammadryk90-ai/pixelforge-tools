import Link from "next/link";
import {
  Minimize2,
  Gauge,
  SlidersHorizontal,
  Sparkles,
  FileText,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
} from "lucide-react";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { blogPosts } from "@/lib/blog-data";
import { buildWebSiteSchema } from "@/lib/seo-schema";

const tools = [
  {
    href: "/compress-image",
    title: "Image Compressor",
    description:
      "Shrink JPG, PNG, and WebP file sizes by up to 80% while preserving crisp visual quality.",
    icon: Minimize2,
    badge: "Batch Supported",
  },
  {
    href: "/compress-to-kb",
    title: "Compress to Exact KB",
    description:
      "Hit exact 20KB, 50KB, 100KB, or 200KB limits automatically for passport, visa, and job forms.",
    icon: Gauge,
    badge: "Exact Size",
  },
  {
    href: "/photo-editor",
    title: "Online Photo Editor",
    description:
      "Crop to social or passport ratios, rotate, flip, resize, apply filters, and add text overlays.",
    icon: SlidersHorizontal,
    badge: "All-in-One",
  },
  {
    href: "/enhance-image",
    title: "Image Quality Enhancer",
    description:
      "Sharpen soft details, balance contrast & color, and upscale resolution up to 2x with live preview.",
    icon: Sparkles,
    badge: "Live Slider",
  },
  {
    href: "/image-to-pdf",
    title: "Image to PDF Converter",
    description:
      "Combine multiple photos or scans into a clean, printable A4 or Letter PDF document in seconds.",
    icon: FileText,
    badge: "Multi-Page",
  },
];

export default function HomePage() {
  return (
    <div>
      <JsonLd data={buildWebSiteSchema()} />
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-indigo-50/70 via-white to-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            100% Free &bull; Zero Server Uploads &bull; Instant Results
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Compress, Enhance &amp; Convert Images to PDF
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Fast, privacy-first image tools that run directly inside your
            browser. Reduce file sizes, sharpen blurry photos, and build
            multi-page PDFs without ever uploading your files.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/compress-image"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Start Compressing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/image-to-pdf"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Convert Image to PDF
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Choose a Tool
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            No sign-up, no watermarks, and no daily limits.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                  Open Tool
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10">
          <AdSlot format="horizontal" />
        </div>
      </section>

      {/* Why PixelForge */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Why Creators &amp; Professionals Use PixelForge
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <ShieldCheck className="h-7 w-7 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Complete File Privacy
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Your photos, IDs, and documents are processed locally in browser
                memory. Nothing is ever uploaded to external servers.
              </p>
            </div>
            <div className="space-y-2">
              <Zap className="h-7 w-7 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Built for Speed
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Instant compression, live sharpening previews, and rapid PDF
                generation with zero server queue delays.
              </p>
            </div>
            <div className="space-y-2">
              <Globe className="h-7 w-7 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Works on Any Device
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Responsive, mobile-friendly design that works smoothly on
                desktop, tablet, and smartphone browsers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Helpful Guides &amp; Tips
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Learn best practices for web performance, image formats, and PDF
              workflows.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all guides &rarr;
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-xs font-semibold text-indigo-600">
                {post.category}
              </span>
              <h3 className="mt-2 text-base font-bold text-slate-900 line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
