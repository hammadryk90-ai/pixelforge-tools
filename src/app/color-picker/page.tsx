import type { Metadata } from "next";
import ColorPickerTool from "@/components/tools/ColorPickerTool";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import RelatedTools from "@/components/RelatedTools";
import { buildToolSchema } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title: "Free Image Color Picker, Palette Extractor & CSS Gradient Generator",
  description:
    "Pick exact HEX, RGB, and HSL colors from any photo, extract dominant color palettes automatically, and generate CSS gradients locally in your browser.",
  alternates: { canonical: "/color-picker" },
};

export default function ColorPickerPage() {
  const schema = buildToolSchema({
    name: "PixelForge Image Color Picker & CSS Gradient Generator",
    description:
      "Pick HEX, RGB, and HSL colors from any image, extract dominant palettes, and generate CSS linear gradients.",
    path: "/color-picker",
    faqs: [
      {
        question: "How do I find the exact HEX color code from an image?",
        answer:
          "Drop your photo into PixelForge Image Color Picker and click any pixel on the canvas. The exact HEX, RGB, and HSL codes appear instantly with one-click copy buttons.",
      },
      {
        question: "Are uploaded images stored on a server?",
        answer:
          "No. Color sampling and palette extraction run 100% inside your web browser.",
      },
    ],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd data={schema} />

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Image Color Picker &amp; Palette Extractor
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          Sample exact <strong>HEX, RGB, and HSL</strong> codes from any photo,
          extract a matching color palette automatically, or design smooth{" "}
          <strong>CSS gradients</strong>—100% locally in your browser.
        </p>
      </div>

      <ColorPickerTool />

      <div className="my-10">
        <AdSlot format="horizontal" />
      </div>

      <article className="mt-12 space-y-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Match Brand Colors &amp; Build Palettes in Seconds
          </h2>
          <p className="mt-2 leading-relaxed text-slate-700">
            Whether you are designing a website, creating a YouTube thumbnail,
            or matching a client&apos;s logo colors, our browser-based color
            picker gives you pixel-accurate HEX, RGB, and HSL values instantly
            without opening heavy design software.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                What is the difference between HEX, RGB, and HSL?
              </h3>
              <p className="mt-1 text-slate-700">
                <strong>HEX</strong> (like <code>#4F46E5</code>) is standard for
                CSS and design tools; <strong>RGB</strong> represents red,
                green, and blue channels; and <strong>HSL</strong> makes it easy
                to adjust lightness and saturation in CSS.
              </p>
            </div>
          </div>
        </section>
      </article>

      <RelatedTools currentPath="/color-picker" />
    </div>
  );
}
