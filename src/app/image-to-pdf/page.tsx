import type { Metadata } from "next";
import ImageToPdfTool from "@/components/tools/ImageToPdfTool";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Free Image to PDF Converter — Combine JPG & PNG to PDF Online",
  description:
    "Convert JPG, PNG, and WebP images into a single multi-page PDF document in seconds. Reorder pages, pick A4 or Letter, and download privately.",
};

export default function ImageToPdfPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Free Image to PDF Converter
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          Combine one or multiple JPG, PNG, or WebP images into a clean,
          printable PDF document. Reorder pages and customize margins—100%
          locally in your browser.
        </p>
      </div>

      <ImageToPdfTool />

      <div className="my-10">
        <AdSlot format="horizontal" />
      </div>

      <article className="mt-12 space-y-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            How to Convert Images to PDF Safely
          </h2>
          <p className="mt-2 leading-relaxed text-slate-700">
            Whether you are submitting scanned IDs, combining receipts for
            reimbursement, or turning assignment photos into a single file,
            privacy matters. Unlike traditional converters that upload your
            sensitive documents to remote servers, PixelForge builds your PDF
            directly inside your browser memory.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
            <li>
              <strong>Select your images:</strong> Drop one or multiple JPG,
              PNG, or WebP files into the upload box.
            </li>
            <li>
              <strong>Arrange page order:</strong> Use the up/down arrows to
              put pages in the exact sequence you want.
            </li>
            <li>
              <strong>Choose layout:</strong> Pick <strong>A4</strong> or{" "}
              <strong>US Letter</strong> for printing, or{" "}
              <strong>Fit to Image</strong> for digital viewing.
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
                Can I combine multiple photos into one PDF?
              </h3>
              <p className="mt-1 text-slate-700">
                Yes! You can add as many images as you need, reorder them, and
                export them all into a single multi-page PDF file.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Are my documents stored anywhere?
              </h3>
              <p className="mt-1 text-slate-700">
                Never. Once you close or refresh the tab, all temporary browser
                memory is cleared automatically.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
