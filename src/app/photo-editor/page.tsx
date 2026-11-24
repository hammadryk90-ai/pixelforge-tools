import type { Metadata } from "next";
import PhotoEditorTool from "@/components/tools/PhotoEditorTool";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import RelatedTools from "@/components/RelatedTools";
import { buildToolSchema } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title: "Free Online Photo Editor — Crop, Resize, Filters & Add Text",
  description:
    "Edit photos directly in your browser for free. Crop to Instagram, YouTube, or Passport ratios, rotate, flip, apply filters, add text watermarks, and export privately.",
  alternates: { canonical: "/photo-editor" },
};

export default function PhotoEditorPage() {
  const schema = buildToolSchema({
    name: "PixelForge Free Online Photo Editor",
    description:
      "Crop, rotate, flip, resize, apply color filters, and add text overlays to photos directly in your browser.",
    path: "/photo-editor",
    faqs: [
      {
        question: "Is this online photo editor free and watermark-free?",
        answer:
          "Yes. You can crop, filter, resize, and add your own custom text without any forced watermarks or account registration.",
      },
      {
        question: "Are my photos uploaded to a cloud server?",
        answer:
          "No. Every edit happens locally inside your web browser using the HTML5 Canvas API, so your images remain 100% private.",
      },
      {
        question: "What aspect ratios are supported for cropping?",
        answer:
          "You can keep the original ratio or crop cleanly to 1:1 Square, 16:9 YouTube, 4:5 Instagram, 4:3, 3:4, or Passport dimensions.",
      },
    ],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd data={schema} />

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Free Online Photo Editor
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          Crop to social or passport aspect ratios, rotate, flip, resize, apply
          one-click filters, and add text watermarks—100% locally in your
          browser.
        </p>
      </div>

      <PhotoEditorTool />

      <div className="my-10">
        <AdSlot format="horizontal" />
      </div>

      <article className="mt-12 space-y-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Everything You Need for Quick Photo Editing
          </h2>
          <p className="mt-2 leading-relaxed text-slate-700">
            You do not need heavy desktop software just to crop a thumbnail,
            straighten a sideways photo, add a quick caption, or prepare a
            passport-ratio headshot. PixelForge Photo Editor runs smoothly on
            both desktop and mobile browsers with live preview.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>
              <strong>Transform &amp; Crop:</strong> Rotate 90° left or right,
              flip horizontally/vertically, crop to 1:1, 16:9, 4:5, or Passport
              ratios, and resize exact pixel width.
            </li>
            <li>
              <strong>Filters &amp; Color Tuning:</strong> Try one-click presets
              like <em>Vivid</em>, <em>Warm</em>, <em>Cool</em>, <em>B&amp;W</em>,{" "}
              <em>Vintage</em>, and <em>Cinematic</em>, or fine-tune brightness,
              contrast, saturation, and blur.
            </li>
            <li>
              <strong>Text &amp; Watermark Overlay:</strong> Add titles,
              copyright watermarks, or captions with adjustable size, opacity,
              color, and drop shadow.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Is this online photo editor free and watermark-free?
              </h3>
              <p className="mt-1 text-slate-700">
                Yes. All editing tools are 100% free with no forced watermarks
                and no sign-up required.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Can I compress my edited photo afterward?
              </h3>
              <p className="mt-1 text-slate-700">
                Yes! Export your edited photo as WebP for the smallest web file
                size, or drop the exported file into our{" "}
                <a
                  href="/compress-to-kb"
                  className="font-semibold text-indigo-600 underline"
                >
                  Exact KB Compressor
                </a>{" "}
                to hit 50 KB or 100 KB limits.
              </p>
            </div>
          </div>
        </section>
      </article>

      <RelatedTools currentPath="/photo-editor" />
    </div>
  );
}
