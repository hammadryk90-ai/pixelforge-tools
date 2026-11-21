import type { Metadata } from "next";
import ImageConverterTool from "@/components/tools/ImageConverterTool";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { buildToolSchema } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title: "Free Image Format Converter — HEIC to JPG, PNG, WebP, AVIF & Smallest Format",
  description:
    "Convert iPhone HEIC photos to JPEG, or convert PNG, JPG, WebP, and AVIF images to the smallest format automatically. 100% private client-side conversion.",
  alternates: { canonical: "/convert-image" },
};

export default function ConvertImagePage() {
  const schema = buildToolSchema({
    name: "PixelForge All-in-One Image Format Converter",
    description:
      "Convert HEIC to JPEG and switch between PNG, JPEG, WebP, AVIF, or auto-selected smallest format locally in your browser.",
    path: "/convert-image",
    faqs: [
      {
        question: "How do I convert iPhone HEIC photos to JPEG safely?",
        answer:
          "Drop your .heic files into PixelForge Converter, pick JPEG (or Smallest Auto), and download instantly. Everything runs inside your browser with zero server uploads.",
      },
      {
        question: "What does Smallest Format (Auto) do?",
        answer:
          "Smallest Format automatically encodes your image as WebP, JPEG, and PNG in browser memory and selects whichever produces the lowest file size.",
      },
      {
        question: "When should I use AVIF vs WebP vs JPEG?",
        answer:
          "Use AVIF or WebP for modern websites and Core Web Vitals speed, JPEG for universal compatibility on portals and email, and PNG for lossless graphics or transparency.",
      },
    ],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd data={schema} />

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Free Image Format Converter
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          Convert <strong>HEIC to JPEG</strong>, switch between{" "}
          <strong>PNG, JPEG, WebP, and AVIF</strong>, or use{" "}
          <strong>Smallest Format (Auto)</strong> to pick the lightest web file
          automatically—100% locally in your browser.
        </p>
      </div>

      <ImageConverterTool />

      <div className="my-10">
        <AdSlot format="horizontal" />
      </div>

      <article className="mt-12 space-y-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Supported Formats &amp; When to Use Each
          </h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-slate-700">
            <li>
              <strong>HEIC to JPEG:</strong> iPhones capture photos in Apple&apos;s
              HEIC format, which many Windows apps and online portals reject.
              Converting HEIC to JPEG makes them universally compatible.
            </li>
            <li>
              <strong>Smallest Format (Auto):</strong> Automatically compares
              WebP, JPEG, and PNG and chooses the smallest file for maximum
              website loading speed.
            </li>
            <li>
              <strong>WebP &amp; AVIF:</strong> Next-generation web formats that
              deliver 25–50% smaller sizes than traditional JPEG and PNG while
              preserving sharp visual quality.
            </li>
            <li>
              <strong>PNG:</strong> Best for logos, UI screenshots, sharp text,
              and graphics requiring transparent backgrounds.
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
                How do I convert iPhone HEIC photos to JPEG safely?
              </h3>
              <p className="mt-1 text-slate-700">
                Drop your <code>.heic</code> files above, choose{" "}
                <strong>JPEG</strong>, and click Download. Because conversion
                runs locally inside your browser, your personal photos never
                leave your device.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                What does Smallest Format (Auto) do?
              </h3>
              <p className="mt-1 text-slate-700">
                It automatically tests WebP, JPEG, and PNG at your selected
                quality and gives you whichever format produces the smallest
                file size.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
