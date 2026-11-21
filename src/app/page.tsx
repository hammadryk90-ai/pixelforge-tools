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
  GraduationCap,
  Code2,
  Camera,
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
    iconBg: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    badgeStyle: "bg-indigo-50 text-indigo-700",
    hoverBorder: "hover:border-indigo-300",
    linkColor: "text-indigo-600",
  },
  {
    href: "/compress-to-kb",
    title: "Compress to Exact KB",
    description:
      "Hit exact 20KB, 50KB, 100KB, or 200KB limits automatically for passport, visa, and job forms.",
    icon: Gauge,
    badge: "Exact Size",
    iconBg: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    badgeStyle: "bg-emerald-50 text-emerald-700",
    hoverBorder: "hover:border-emerald-300",
    linkColor: "text-emerald-600",
  },
  {
    href: "/photo-editor",
    title: "Online Photo Editor",
    description:
      "Crop to social or passport ratios, rotate, flip, resize, apply filters, and add text overlays.",
    icon: SlidersHorizontal,
    badge: "All-in-One",
    iconBg: "bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
    badgeStyle: "bg-rose-50 text-rose-700",
    hoverBorder: "hover:border-rose-300",
    linkColor: "text-rose-600",
  },
  {
    href: "/enhance-image",
    title: "Image Quality Enhancer",
    description:
      "Sharpen soft details, balance contrast & color, and upscale resolution up to 2x with live preview.",
    icon: Sparkles,
    badge: "Live Slider",
    iconBg: "bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
    badgeStyle: "bg-amber-50 text-amber-700",
    hoverBorder: "hover:border-amber-300",
    linkColor: "text-amber-600",
  },
  {
    href: "/image-to-pdf",
    title: "Image to PDF Converter",
    description:
      "Combine multiple photos or scans into a clean, printable A4 or Letter PDF document in seconds.",
    icon: FileText,
    badge: "Multi-Page",
    iconBg: "bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
    badgeStyle: "bg-violet-50 text-violet-700",
    hoverBorder: "hover:border-violet-300",
    linkColor: "text-violet-600",
  },
];

const workflows = [
  {
    tag: "WEB & SEO",
    tagColor: "text-sky-600",
    icon: Code2,
    iconBg: "bg-sky-100 text-sky-600",
    title: "Bloggers & Developers",
    before: "Convert heavy PNGs and camera photos into lightweight WebP files to ",
    highlight: "boost Core Web Vitals and page speed",
    highlightColor: "text-sky-600",
    after: " without sacrificing visual sharpness.",
    role: "Faster websites & higher SEO scores",
  },
  {
    tag: "FORMS & APPLICATIONS",
    tagColor: "text-emerald-600",
    icon: GraduationCap,
    iconBg: "bg-emerald-100 text-emerald-600",
    title: "Students & Job Seekers",
    before: "Shrink passport photos under 50KB or 100KB and merge scanned certificates into one ",
    highlight: "clean, ready-to-upload A4 PDF",
    highlightColor: "text-emerald-600",
    after: " while keeping personal IDs completely private.",
    role: "Passport, visa & university portals",
  },
  {
    tag: "CONTENT CREATORS",
    tagColor: "text-rose-600",
    icon: Camera,
    iconBg: "bg-rose-100 text-rose-600",
    title: "Designers & Freelancers",
    before: "Crop to 16:9 YouTube or 4:5 Instagram ratios, apply one-click color filters, and ",
    highlight: "sharpen blurry shots in seconds",
    highlightColor: "text-rose-600",
    after: " directly in the browser with zero watermarks.",
    role: "Social media, thumbnails & portfolios",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero with subtle colorful ambient glow */}
      <section className="relative border-b border-slate-200/80 bg-white py-16 sm:py-22">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-amber-100/60 blur-3xl" />
        </div>

        <JsonLd data={buildWebSiteSchema()} />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-xs backdrop-blur-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            100% Free &bull; Zero Server Uploads &bull; Instant Browser Processing
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Compress, Edit &amp; Convert{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent">
              Images to PDF
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Fast, privacy-first image tools that run directly inside your
            browser. Reduce file sizes, edit and sharpen photos, and build
            multi-page PDFs without ever uploading your files.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/compress-image"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:brightness-110"
            >
              Start Compressing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/photo-editor"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-xs transition-colors hover:border-indigo-300 hover:bg-indigo-50/40"
            >
              Open Photo Editor
            </Link>
            <Link
              href="/image-to-pdf"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-xs transition-colors hover:border-violet-300 hover:bg-violet-50/40"
            >
              Image to PDF
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            All-In-One Toolkit
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
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
                className={`group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${tool.hoverBorder}`}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${tool.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tool.badgeStyle}`}
                    >
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
                <div
                  className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${tool.linkColor}`}
                >
                  Open Tool
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10">
          <AdSlot format="horizontal" />
        </div>
      </section>

      {/* TinyPNG-inspired Glowing 3-Card Workflow Showcase */}
      <section className="relative py-16 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <div className="h-72 w-[700px] rounded-full bg-gradient-to-r from-rose-200/45 via-amber-200/50 to-sky-200/45 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
              Built For Every Workflow
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              How People Use PixelForge Every Day
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {workflows.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/95 p-7 shadow-md shadow-slate-200/50 backdrop-blur-xs"
                >
                  <div>
                    <span
                      className={`text-xs font-extrabold uppercase tracking-wider ${item.tagColor}`}
                    >
                      {item.tag}
                    </span>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {item.before}
                      <span className={`font-semibold ${item.highlightColor}`}>
                        {item.highlight}
                      </span>
                      {item.after}
                    </p>
                  </div>

                  <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why PixelForge */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Why Creators &amp; Professionals Trust PixelForge
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Complete File Privacy
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Your photos, IDs, and documents are processed locally in browser
                memory. Nothing is ever uploaded to external servers.
              </p>
            </div>
            <div className="space-y-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Zap className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Built for Speed
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Instant compression, live photo editing previews, and rapid PDF
                generation with zero server queue delays.
              </p>
            </div>
            <div className="space-y-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Globe className="h-5 w-5" />
              </span>
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
          {blogPosts.slice(0, 6).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
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
