import type { Metadata } from "next";
import PdfToolkitTool from "@/components/tools/PdfToolkitTool";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import RelatedTools from "@/components/RelatedTools";
import { buildToolSchema } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title: "Free Online PDF Toolkit — Merge, Split, Watermark & Number PDF Pages",
  description:
    "Merge multiple PDFs, extract specific pages, add custom text watermarks, and insert page numbers directly in your browser. 100% free and private.",
  alternates: { canonical: "/pdf-tools" },
};

export default function PdfToolsPage() {
  const schema = buildToolSchema({
    name: "PixelForge Free Online PDF Toolkit",
    description:
      "Merge PDFs, split or extract pages, add text watermarks, and number PDF pages locally in your browser.",
    path: "/pdf-tools",
    faqs: [
      {
        question: "Are my PDF documents uploaded to any server?",
        answer:
          "No. PixelForge processes PDFs directly in your browser using client-side JavaScript so contracts, resumes, and IDs stay completely private.",
      },
      {
        question: "Can I merge multiple PDFs in a custom order?",
        answer:
          "Yes. Add as many PDF files as you need, arrange them with the up/down arrows, and click Merge & Download PDF.",
      },
      {
        question: "How do I extract specific pages from a large PDF?",
        answer:
          "Switch to the Split / Extract tab, upload your PDF, enter the page numbers or ranges (such as 1-3, 5), and download your new PDF instantly.",
      },
    ],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd data={schema} />

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Free Online PDF Toolkit
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          <strong>Merge PDFs</strong>, <strong>Split &amp; Extract pages</strong>,
          stamp <strong>Watermarks</strong>, and add{" "}
          <strong>Page Numbers</strong>—100% locally inside your browser with
          zero file uploads.
        </p>
      </div>

      <PdfToolkitTool />

      <div className="my-10">
        <AdSlot format="horizontal" />
      </div>

      <article className="mt-12 space-y-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Four Essential PDF Tools in One Private Workspace
          </h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-slate-700">
            <li>
              <strong>Merge PDF:</strong> Combine resumes, cover letters,
              invoices, or scanned assignments into one organized PDF file.
            </li>
            <li>
              <strong>Split / Extract Pages:</strong> Pull out only the exact
              pages you need from a long report or e-book using simple ranges
              like <code>1-3, 7</code>.
            </li>
            <li>
              <strong>Watermark PDF:</strong> Stamp diagonal text such as{" "}
              <em>CONFIDENTIAL</em> or <em>DRAFT</em> across every page with
              adjustable opacity.
            </li>
            <li>
              <strong>Number Pages:</strong> Automatically add clean page
              numbers (<code>1 / 10</code>, <code>Page 1</code>, or{" "}
              <code>1</code>) to the bottom center or bottom right.
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
                Are my PDF documents uploaded to any server?
              </h3>
              <p className="mt-1 text-slate-700">
                No. All PDF operations run locally in your browser memory, so
                sensitive documents never leave your device.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Is there a file count limit or watermark?
              </h3>
              <p className="mt-1 text-slate-700">
                No forced watermarks and no daily limits—use all four PDF tools
                freely as often as you need.
              </p>
            </div>
          </div>
        </section>
      </article>

      <RelatedTools currentPath="/pdf-tools" />
    </div>
  );
}
