import type { Metadata } from "next";
import ImageEnhancerTool from "@/components/tools/ImageEnhancerTool";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Free Image Quality Enhancer & Upscaler — Sharpen Photos Online",
  description:
    "Improve image quality, sharpen blurry edges, balance lighting, and upscale resolution up to 2x right in your browser. Free and 100% private.",
};

export default function EnhanceImagePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Image Quality Enhancer &amp; Upscaler
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          Sharpen soft details, boost contrast and color vibrance, and upscale
          low-resolution photos up to 2x—instantly in your browser.
        </p>
      </div>

      <ImageEnhancerTool />

      <div className="my-10">
        <AdSlot format="horizontal" />
      </div>

      <article className="mt-12 space-y-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            How Browser-Based Image Enhancement Works
          </h2>
          <p className="mt-2 leading-relaxed text-slate-700">
            Many photos look dull or slightly soft due to lighting conditions,
            social media re-compression, or low camera resolution. Our enhancer
            uses a high-quality interpolation pipeline combined with a 3×3
            sharpening convolution filter to bring out crisp edges, text, and
            textures without uploading your private photos to any server.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>
              <strong>Sharpness / Clarity:</strong> Accentuates edge contrast so
              portraits, documents, and product photos look cleaner.
            </li>
            <li>
              <strong>Resolution Upscale (1.5x / 2x):</strong> Expands image
              dimensions smoothly for printing or high-DPI displays.
            </li>
            <li>
              <strong>Tone &amp; Color Balance:</strong> Fine-tune brightness,
              contrast, and vibrance with a real-time Before/After slider.
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
                What is the best setting for blurry document scans?
              </h3>
              <p className="mt-1 text-slate-700">
                Try setting <strong>Sharpness</strong> to 45–60%,{" "}
                <strong>Contrast</strong> to +15, and{" "}
                <strong>Upscale</strong> to 1.5x, then download as PNG for
                crisp text.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Is there a file limit or watermark?
              </h3>
              <p className="mt-1 text-slate-700">
                No watermarks and no daily limits. Because everything runs on
                your own device, you can enhance as many images as you like.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
