import type { Metadata } from "next";
import ExactKbCompressorTool from "@/components/tools/ExactKbCompressorTool";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Compress Image to 20KB, 50KB, 100KB or 200KB Online",
  description:
    "Reduce JPG or WebP image size to an exact KB target (20KB, 50KB, 100KB, 200KB) for passport, visa, university, and job portal uploads. 100% private.",
};

export default function CompressToKbPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Compress Image to Exact KB Size
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          Automatically hit 20 KB, 50 KB, 100 KB, 200 KB, or any custom size
          for passport, visa, and online application portals—processed locally
          in your browser.
        </p>
      </div>

      <ExactKbCompressorTool />

      <div className="my-10">
        <AdSlot format="horizontal" />
      </div>

      <article className="mt-12 space-y-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Why Online Forms Require Exact KB Limits
          </h2>
          <p className="mt-2 leading-relaxed text-slate-700">
            Government portals, scholarship applications, and job boards often
            reject photos larger than <strong>50 KB</strong>,{" "}
            <strong>100 KB</strong>, or <strong>200 KB</strong>. Instead of
            guessing quality percentages manually, our Exact KB Compressor
            automatically balances compression quality and dimensions so your
            image fits right under your target limit while staying readable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Common Size Targets by Use Case
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            <li>
              <strong>20 KB – 50 KB:</strong> Digital signatures, small ID
              thumbnails, and strict government portal uploads.
            </li>
            <li>
              <strong>100 KB – 200 KB:</strong> Passport photos, university
              admission forms, and resume headshots.
            </li>
            <li>
              <strong>500 KB:</strong> Scanned certificates, transcripts, and
              blog feature images.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
