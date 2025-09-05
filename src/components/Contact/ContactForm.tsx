"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      subject: String(fd.get("subject") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to submit");
      setSuccess("Thanks! I will get back to you shortly.");
      form.reset();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {success ? <div className="text-sm text-green-500">{success}</div> : null}
      {error ? <div className="text-sm text-red-500">{error}</div> : null}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Name</label>
        <input name="name" type="text" id="name" className="w-full px-3 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-foreground" placeholder="Your name" required />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
        <input name="email" type="email" id="email" className="w-full px-3 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-foreground" placeholder="your@email.com" required />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">Subject</label>
        <input name="subject" type="text" id="subject" className="w-full px-3 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-foreground" placeholder="Project discussion" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">Message</label>
        <textarea name="message" id="message" rows={6} className="w-full px-3 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-foreground resize-none" placeholder="Tell me about your project..." required />
      </div>

      <button disabled={loading} type="submit" className="w-full bg-[var(--accent-primary)] text-black py-3 px-4 rounded-lg font-medium hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-60">
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
