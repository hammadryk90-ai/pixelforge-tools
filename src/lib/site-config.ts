export const siteConfig = {
  name: "PixelForge",
  fullName: "PixelForge Studio",
  tagline: "Free, Private Browser-Based Image & PDF Tools",
  description:
    "Compress images to smaller sizes, enhance photo quality, and convert images to PDF instantly in your browser. 100% free, no file uploads, complete privacy.",
  // Primary production domain
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pixelforgeimg.com",
  // Support email shown on Contact, Privacy Policy, and Terms pages
  supportEmail: "Hammadryk90@gmail.com",
  // Add your Google AdSense Publisher ID in .env.local as NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || "",
};
