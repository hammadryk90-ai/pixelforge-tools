"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Contact Us
      </h1>
      <p className="mt-3 text-base text-slate-600">
        Have a question, feature request, or business inquiry? Send us a message
        below or email us directly at{" "}
        <a
          href={`mailto:${siteConfig.supportEmail}`}
          className="font-semibold text-indigo-600 underline"
        >
          {siteConfig.supportEmail}
        </a>
        .
      </p>

      {submitted ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Message Ready
          </div>
          <p className="mt-2 text-sm">
            Thank you, {name || "there"}! Your message has been recorded. For
            the fastest response, you can also send your inquiry directly to{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(`Contact from ${name}`)}&body=${encodeURIComponent(message)}`}
              className="font-semibold underline"
            >
              {siteConfig.supportEmail}
            </a>
            .
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Your Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ali Khan"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Mail className="h-4 w-4" />
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
