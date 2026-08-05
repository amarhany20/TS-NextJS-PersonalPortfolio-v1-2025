'use client';

import { useState, type FormEvent } from 'react';

interface ContactFormProps {
  heading?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMPTY_ERRORS: FormErrors = {};

function validate(name: string, email: string, subject: string, message: string): FormErrors {
  const errors: FormErrors = {};

  if (name.trim().length < 2 || name.trim().length > 120) {
    errors.name = 'Please enter your name (2-120 characters).';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 160) {
    errors.email = 'Please enter a valid email address.';
  }

  if (subject && (subject.trim().length < 3 || subject.trim().length > 200)) {
    errors.subject = 'Subject must be 3-200 characters.';
  }

  if (message.trim().length < 10 || message.trim().length > 5000) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
}

export function ContactForm({ heading }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(EMPTY_ERRORS);
    setStatusMessage('');

    const nextErrors = validate(name, email, subject, message);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || undefined,
          message: message.trim(),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const message = payload?.error?.message ?? 'Unable to send your message. Please try again.';
        setStatus('error');
        setStatusMessage(message);
        return;
      }

      setStatus('success');
      setStatusMessage('Message sent! I will get back to you as soon as possible.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setStatus('error');
      setStatusMessage('A network error occurred. Please try again.');
    }
  };

  const inputClass =
    'w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-foreground outline-none focus:border-[var(--accent-primary)] placeholder:text-[var(--text-secondary)]/60';

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{heading ?? 'Send a message'}</h3>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="contact-name" className="block text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
              autoComplete="name"
            />
            {errors.name ? <p className="text-xs text-red-500">{errors.name}</p> : null}
          </div>

          <div className="space-y-1">
            <label htmlFor="contact-email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              autoComplete="email"
            />
            {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground">
            Subject <span className="text-[var(--text-secondary)]">(optional)</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="How can I help?"
            className={inputClass}
          />
          {errors.subject ? <p className="text-xs text-red-500">{errors.subject}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="contact-message" className="block text-sm font-medium text-foreground">
            Message
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me about your project or inquiry..."
            rows={5}
            className={`${inputClass} resize-y`}
          />
          {errors.message ? <p className="text-xs text-red-500">{errors.message}</p> : null}
        </div>

        {status === 'success' ? (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-50">
            {statusMessage}
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-50">
            {statusMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center w-full rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
