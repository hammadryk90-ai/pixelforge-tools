import type { Metadata } from "next";
import ImageCompressorTool from "@/components/tools/ImageCompressorTool";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import RelatedTools from "@/components/RelatedTools";
import { buildToolSchema } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title: "Free Online Image Compressor — Reduce JPG, PNG & WebP Size",
  description:
    "Compress JPG, PNG, and WebP images to smaller file sizes without losing visible quality. 100% private client-side compression in your browser.",
  alternates: { canonical: "/compress-image" },
};

export default function CompressImagePage() {
  const schema = buildToolSchema({
    name: "PixelForge Free Online Image Compressor",
    description:
      "Compress JPG, PNG, and WebP images to smaller file sizes without losing visible quality.",
    path: "/compress-image",
    faqs: [
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. PixelForge processes every image directly inside your web browser using the HTML5 Canvas API. Your photos never leave your device.",
      },
      {
        question: "Which output format should I pick?",
        answer:
          "Use WebP for websites and blogs, JPEG for universal compatibility, and PNG when you need crisp graphics or transparency.",
      },
    ],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd data={schema} />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Free Online Image Compressor
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          Shrink JPG, PNG, and WebP file sizes by up to 80% while keeping sharp
          visual quality. Everything runs locally on your device—no uploads, no
          watermarks.
        </p>
      </div>

      <ImageCompressorTool />

      <div className="my-10">
        <AdSlot format="horizontal" />
      </div>

      <article className="prose prose-slate mt-12 max-w-none space-y-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            How to Compress Images Without Losing Quality
          </h2>
          <p className="mt-2 leading-relaxed text-slate-700">
            Modern smartphones and cameras save photos at high resolutions and
            minimal compression, often resulting in 3 MB to 10 MB files. When
            you upload those images directly to a website, blog, or online
            application form, they slow down page loading and waste bandwidth.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
            <li>
              <strong>Adjust quality:</strong> Start around <strong>75%</strong>{" "}
              for photographs. Most viewers cannot tell the difference between
              100% and 75% quality, yet the file size drops dramatically.
            </li>
            <li>
              <strong>Resize if needed:</strong> If your photo is 4000px wide
              but only displayed on a website or sent via email, setting Max
              Width to <strong>1280px</strong> or <strong>1920px</strong>{" "}
              cuts file size even further.
            </li>
            <li>
              <strong>Choose WebP for websites:</strong> Converting JPG or PNG
              images to <strong>WebP</strong> typically saves an extra 25–35%
              in file size.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Are my images uploaded to a server?
              </h3>
              <p className="mt-1 text-slate-700">
                No. PixelForge processes every image directly inside your web
                browser using the HTML5 Canvas API. Your photos never leave your
                computer or phone.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Which output format should I pick?
              </h3>
              <p className="mt-1 text-slate-700">
                Use <strong>WebP</strong> for websites and blogs,{" "}
                <strong>JPEG</strong> for universal compatibility (email,
                government portals, resumes), and <strong>PNG</strong> when you
                need crisp graphics or transparency.
              </p>
            </div>
          </div>
        </section>
      </article>

      <RelatedTools currentPath="/compress-image" />
    </div>
  );
}
