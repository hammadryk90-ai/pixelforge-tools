"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

interface AdSlotProps {
  slotId?: string;
  format?: "auto" | "horizontal" | "rectangle";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * AdSense-ready container with fixed minimum height to prevent
 * Cumulative Layout Shift (CLS) — important for Core Web Vitals and AdSense approval.
 */
export default function AdSlot({
  slotId = "0000000000",
  format = "auto",
  className = "",
}: AdSlotProps) {
  const hasAdsense = Boolean(siteConfig.adsenseId);

  useEffect(() => {
    if (!hasAdsense) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore duplicate push errors in React strict mode
    }
  }, [hasAdsense]);

  const minHeightClass =
    format === "rectangle" ? "min-h-[250px]" : "min-h-[100px]";

  if (!hasAdsense) {
    return (
      <div
        className={`flex w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-center text-xs text-slate-400 ${minHeightClass} ${className}`}
        aria-label="Advertisement placeholder"
      >
        <span>
          Ad Space ({format}) — Set{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-500">
            NEXT_PUBLIC_ADSENSE_ID
          </code>{" "}
          after AdSense approval
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden text-center ${minHeightClass} ${className}`}>
      <ins
        className="adsbygoogle block"
        data-ad-client={siteConfig.adsenseId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
