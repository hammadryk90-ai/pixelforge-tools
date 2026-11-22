import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-bold text-slate-900"
            >
              <BrandLogo className="h-7 w-7" />
              <span>{siteConfig.fullName}</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600">
              Fast, free, and private image optimization and PDF conversion tools.
              All processing runs locally inside your browser.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% Client-Side Privacy
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/compress-image" className="hover:text-indigo-600">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/convert-image" className="hover:text-indigo-600">
                  Format Converter (HEIC / WebP / AVIF)
                </Link>
              </li>
              <li>
                <Link href="/compress-to-kb" className="hover:text-indigo-600">
                  Compress to Exact KB
                </Link>
              </li>
              <li>
                <Link href="/photo-editor" className="hover:text-indigo-600">
                  Photo Editor
                </Link>
              </li>
              <li>
                <Link href="/enhance-image" className="hover:text-indigo-600">
                  Image Quality Enhancer
                </Link>
              </li>
              <li>
                <Link href="/image-to-pdf" className="hover:text-indigo-600">
                  Image to PDF Converter
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="hover:text-indigo-600">
                  PDF Toolkit (Merge / Split / Watermark)
                </Link>
              </li>
              <li>
                <Link href="/qr-generator" className="hover:text-indigo-600">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/color-picker" className="hover:text-indigo-600">
                  Color Picker &amp; Gradients
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:text-indigo-600">
                  Guides & Tutorials
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-indigo-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {year} {siteConfig.fullName}. All rights reserved.
          </p>
          <p>Built for speed, accessibility, and privacy.</p>
        </div>
      </div>
    </footer>
  );
}
