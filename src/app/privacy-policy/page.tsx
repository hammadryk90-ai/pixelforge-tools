import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.fullName}, including client-side file handling, cookies, and Google AdSense disclosures.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Last updated: November 20, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            1. Local Browser Processing (No File Uploads)
          </h2>
          <p>
            {siteConfig.fullName} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
            &ldquo;us&rdquo;) provides browser-based image compression, image
            enhancement, and Image-to-PDF conversion tools. All image and PDF
            processing happens locally on your device using client-side browser
            APIs. We do not upload, store, or transmit your images or generated
            PDFs to our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            2. Cookies and Advertising (Google AdSense)
          </h2>
          <p>
            We may display advertisements served by{" "}
            <strong>Google AdSense</strong> and other third-party advertising
            partners to keep our tools free.
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Third-party vendors, including Google, use cookies to serve ads
              based on a user&apos;s prior visits to this website or other
              websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its
              partners to serve ads to you based on your visit to our site
              and/or other sites on the Internet.
            </li>
            <li>
              You may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 underline"
              >
                Google Ads Settings
              </a>{" "}
              or{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 underline"
              >
                www.aboutads.info
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            3. Log Files &amp; Analytics
          </h2>
          <p>
            Like most standard websites, our hosting provider may automatically
            collect standard server log data such as IP addresses, browser type,
            referring/exit pages, and timestamps for security and aggregate
            traffic analysis. This data is not linked to any personally
            identifiable information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            4. Your Privacy Rights (GDPR &amp; CCPA)
          </h2>
          <p>
            Depending on your location, you may have the right to request access
            to, correction of, or deletion of any personal data we hold, or to
            opt out of personalized advertising cookies. Since we do not require
            accounts or store uploaded files, we hold minimal to no personal
            data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">5. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at{" "}
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
