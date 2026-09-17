"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // No dedicated contact endpoint yet — simulate submission for now.
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 800);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700">Subject</label>
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          placeholder="How can we help?"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700">Message</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          placeholder="Write your message..."
        />
      </div>

      {sent && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-200">
          Thank you! Your message has been sent — we&apos;ll respond shortly.
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-fit">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send Message
      </button>
    </form>
  );
}
