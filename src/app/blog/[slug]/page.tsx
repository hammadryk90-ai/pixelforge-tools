import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { buildArticleSchema } from "@/lib/seo-schema";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleSchema = buildArticleSchema({
    title: post.title,
    description: post.description,
    slug: post.slug,
    date: post.date,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={articleSchema} />
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all guides
      </Link>

      <article className="space-y-8">
        <header className="space-y-3 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-semibold text-indigo-700">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            {post.description}
          </p>
        </header>

        <AdSlot format="horizontal" />

        <div className="space-y-7">
          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, idx) => (
                <p key={idx} className="leading-relaxed text-slate-700">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6">
          <h3 className="text-lg font-bold text-slate-900">
            Ready to try it yourself?
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Use our free browser-based tool—no sign-up or file uploads required.
          </p>
          <Link
            href={post.relatedTool.href}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {post.relatedTool.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}
