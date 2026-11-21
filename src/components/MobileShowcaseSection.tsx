"use client";

import { useEffect, useState } from "react";
import { Smartphone, Monitor, Download, CheckCircle2 } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function MobileShowcaseSection() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowHint((prev) => !prev);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-slate-50 to-sky-50/80 px-6 py-12 sm:px-12 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Left copy & Install CTA */}
          <div className="space-y-5 text-center lg:col-span-5 lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 shadow-xs">
              <Smartphone className="h-3.5 w-3.5" />
              Installable Web App (PWA)
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Use It on Mobile &amp; Desktop
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Compress photos to exact KB, convert iPhone HEIC images, edit
              visuals, and merge PDFs right from your phone or computer. Install
              PixelForge to your home screen for instant one-tap access—no app
              store download required.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 lg:justify-start">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
              >
                {installed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    App Installed
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Install Free Web App
                  </>
                )}
              </button>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700">
                  Android
                </span>
                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700">
                  iPhone
                </span>
                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700">
                  Windows / Mac
                </span>
              </div>
            </div>

            {showHint && (
              <p className="rounded-xl border border-indigo-200 bg-white/90 px-4 py-3 text-xs leading-relaxed text-slate-700">
                <strong>Quick tip:</strong> On <strong>iPhone (Safari)</strong>,
                tap <strong>Share → Add to Home Screen</strong>. On{" "}
                <strong>Android / Desktop Chrome</strong>, click the{" "}
                <strong>Install</strong> icon in the address bar or browser
                menu.
              </p>
            )}
          </div>

          {/* Right Desktop + Mobile Visual Mockup */}
          <div className="relative flex items-center justify-center lg:col-span-7">
            {/* Desktop Window Mockup */}
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-indigo-900/5">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BrandLogo className="h-6 w-6" />
                  <span className="text-xs font-bold text-slate-900">
                    PixelForge Studio
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Monitor className="h-3.5 w-3.5" />
                  Desktop
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: "passport-photo-50kb.jpg", tag: "50 KB", color: "bg-emerald-100 text-emerald-700" },
                  { name: "iphone-vacation.heic → .jpg", tag: "JPEG", color: "bg-sky-100 text-sky-700" },
                  { name: "product-banner.webp", tag: "-78%", color: "bg-indigo-100 text-indigo-700" },
                  { name: "merged-application.pdf", tag: "PDF", color: "bg-violet-100 text-violet-700" },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2"
                  >
                    <span className="truncate text-xs font-medium text-slate-700">
                      {row.name}
                    </span>
                    <span
                      className={`ml-2 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${row.color}`}
                    >
                      {row.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tilted Phone Mockup overlapping on bottom-right */}
            <div className="hidden w-44 -ml-10 mt-14 rotate-3 rounded-3xl border-4 border-slate-800 bg-white p-3 shadow-2xl sm:block">
              <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-slate-200" />
              <div className="mb-2.5 flex items-center gap-1.5">
                <BrandLogo className="h-5 w-5" />
                <span className="text-[11px] font-bold text-slate-900">
                  Mobile Tools
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[10px] font-semibold text-indigo-700">
                  Compress Image
                </div>
                <div className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-[10px] font-semibold text-rose-700">
                  Photo Editor
                </div>
                <div className="rounded-lg bg-sky-50 px-2.5 py-1.5 text-[10px] font-semibold text-sky-700">
                  HEIC to JPEG
                </div>
                <div className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-[10px] font-semibold text-violet-700">
                  Merge &amp; Split PDF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
