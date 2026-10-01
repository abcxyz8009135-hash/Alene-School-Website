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
          <label htmlFor="contact-name" className="form-label">Name</label>
          <input
            id="contact-name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="form-label">Email</label>
          <input
            id="contact-email"
            autoComplete="email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-subject" className="form-label">Subject</label>
        <input
          id="contact-subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-field"
          placeholder="How can we help?"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="form-label">Message</label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-field resize-y"
          placeholder="Write your message..."
        />
      </div>

      {sent && (
        <p role="status" className="alert-success">
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
