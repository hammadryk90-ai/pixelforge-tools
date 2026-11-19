import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Guides & Tutorials — Image Optimization & PDF Tips",
  description:
    "Practical guides on compressing images without losing quality, choosing between JPG, PNG, and WebP, enhancing photo clarity, and creating private PDFs.",
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

      <div className="grid gap-6 sm:grid-cols-2">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-semibold text-indigo-700">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                <Link href={`/blog/${post.slug}`} className="hover:text-indigo-600">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {post.description}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Read guide
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <AdSlot format="horizontal" />
      </div>
    </div>
  );
}
