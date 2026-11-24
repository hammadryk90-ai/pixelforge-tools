import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";
import BlogListClient from "@/components/BlogListClient";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Guides & Tutorials — Image Optimization & PDF Tips",
  description:
    "Practical guides on compressing images without losing quality, choosing between JPG, PNG, and WebP, enhancing photo clarity, and creating private PDFs.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Image &amp; PDF Guides
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          Practical tutorials to help you optimize images for faster websites,
          sharper visuals, and cleaner PDF documents.
        </p>
      </div>

      <BlogListClient posts={blogPosts} />

      <div className="mt-10">
        <AdSlot format="horizontal" />
      </div>
    </div>
  );
}
