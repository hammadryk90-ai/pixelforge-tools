import type { Metadata } from "next";
import QrGeneratorTool from "@/components/tools/QrGeneratorTool";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import RelatedTools from "@/components/RelatedTools";
import { buildToolSchema } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title: "Free QR Code Generator — URL, WiFi, Email & Text (PNG & SVG)",
  description:
    "Generate permanent, high-resolution QR codes for websites, WiFi networks, emails, and plain text. Customize colors and download PNG or vector SVG for free.",
  alternates: { canonical: "/qr-generator" },
};

export default function QrGeneratorPage() {
  const schema = buildToolSchema({
    name: "PixelForge Free QR Code Generator",
    description:
      "Create permanent static QR codes for URLs, WiFi logins, email, and text with custom colors and PNG/SVG download.",
    path: "/qr-generator",
    faqs: [
      {
        question: "Do QR codes generated here ever expire?",
        answer:
          "Never. PixelForge creates static QR codes that encode your URL, WiFi, or text directly—there are no scan limits and no expiration dates.",
      },
      {
        question: "Is my WiFi password sent to a server?",
        answer:
          "No. QR generation happens 100% locally in your web browser, so your WiFi credentials and links stay private.",
      },
    ],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd data={schema} />

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Free QR Code Generator
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          Create permanent QR codes for website links, WiFi networks, emails,
          and text. Customize colors and export high-resolution{" "}
          <strong>PNG</strong> or <strong>SVG</strong>—100% private in your
          browser.
        </p>
      </div>

      <QrGeneratorTool />

      <div className="my-10">
        <AdSlot format="horizontal" />
      </div>

      <article className="mt-12 space-y-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Static QR Codes That Never Expire
          </h2>
          <p className="mt-2 leading-relaxed text-slate-700">
            Many online QR generators lock your QR code behind a paid redirect
            that stops working after 14 days. PixelForge generates pure{" "}
            <strong>static QR codes</strong> locally in your browser—meaning
            they work forever with unlimited scans, whether printed on business
            cards, menus, product packaging, or flyers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Should I download PNG or SVG?
              </h3>
              <p className="mt-1 text-slate-700">
                Use <strong>PNG (512px or 1024px)</strong> for social media,
                documents, and digital screens. Use <strong>SVG</strong> for
                printing banners, flyers, and business cards because vector SVG
                scales to any size without blurring.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Is my WiFi password sent to any server?
              </h3>
              <p className="mt-1 text-slate-700">
                No. Everything runs locally on your device and nothing is
                uploaded.
              </p>
            </div>
          </div>
        </section>
      </article>

      <RelatedTools currentPath="/qr-generator" />
    </div>
  );
}
