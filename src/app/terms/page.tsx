import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for using ${siteConfig.fullName} image and PDF tools.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Last updated: November 20, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using {siteConfig.fullName}, you agree to be bound
            by these Terms of Service and our Privacy Policy. If you do not
            agree, please discontinue use of the website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            2. Permitted Use
          </h2>
          <p>
            You may use our image compression, enhancement, and Image-to-PDF
            tools for personal, educational, and commercial projects. You are
            solely responsible for ensuring you have the legal right to process
            the images you select.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            3. Disclaimer of Warranties
          </h2>
          <p>
            All tools on {siteConfig.fullName} are provided &ldquo;as is&rdquo;
            and &ldquo;as available&rdquo; without warranties of any kind. Always
            keep backups of your original files before modifying or replacing
            them.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">4. Contact</h2>
          <p>
            For questions regarding these terms, email{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="font-medium text-indigo-600 underline"
            >
              {siteConfig.supportEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
