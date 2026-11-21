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
    return null;
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
