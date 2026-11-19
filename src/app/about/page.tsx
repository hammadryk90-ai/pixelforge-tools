import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Zap, Lock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.fullName}—our mission to provide fast, free, and 100% private browser-based image compression, enhancement, and PDF tools.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        About {siteConfig.fullName}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        {siteConfig.fullName} was built with a simple goal: to give creators,
        students, developers, and everyday users fast image and PDF utilities
        without forcing them to upload private files to unknown servers.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Lock className="h-6 w-6 text-indigo-600" />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Privacy First
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            All compression, sharpening, and PDF generation happens locally in
            your browser memory.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Zap className="h-6 w-6 text-indigo-600" />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Instant Speed
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            No upload queues or waiting for remote servers—results appear in
            milliseconds.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <ShieldCheck className="h-6 w-6 text-indigo-600" />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            Always Free
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            No hidden paywalls, no watermarks, and no account registration
            required.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
        <h2 className="text-xl font-bold text-slate-900">Have Feedback?</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          We are continuously improving our tools and adding new guides. If you
          spot a bug or want to suggest a feature, please reach out via our{" "}
          <Link href="/contact" className="font-semibold text-indigo-600 underline">
            Contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
