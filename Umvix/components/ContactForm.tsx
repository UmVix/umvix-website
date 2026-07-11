"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  MessageSquare,
  Tag,
  User,
} from "lucide-react";
import { submitContact } from "@/lib/contact/submitContact";

const SUBJECTS = [
  "General Inquiry",
  "Consultation Request",
  "Project Discussion",
  "Partnership Opportunity",
];

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-brand-white outline-none transition-colors placeholder:text-brand-gray-muted focus:border-brand-red/40 focus:bg-white/[0.06]";

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-brand-white">
      {children}
      {required && <span className="ml-0.5 text-brand-red">*</span>}
    </label>
  );
}

const initialFormData = {
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await submitContact({
        source: "form",
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        subject: formData.subject,
        message: formData.message,
      });
      setStatus("success");
      setFormData(initialFormData);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") setStatus("idle");
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
        <CheckCircle2 className="mx-auto text-brand-red" size={40} />
        <h3 className="mt-4 text-xl font-bold text-brand-white">Message sent</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-brand-gray">
          Thanks for reaching out. We received your message and will reply within
          one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-primary mt-8 rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="name" required>
            Full Name
          </FieldLabel>
          <div className="relative">
            <User
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-muted"
            />
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className={inputClass}
              disabled={status === "loading"}
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="email" required>
            Email Address
          </FieldLabel>
          <div className="relative">
            <Mail
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-muted"
            />
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className={inputClass}
              disabled={status === "loading"}
            />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="company">Company (Optional)</FieldLabel>
        <div className="relative">
          <Building2
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-muted"
          />
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your company (optional)"
            className={inputClass}
            disabled={status === "loading"}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="subject" required>
          Subject
        </FieldLabel>
        <div className="relative">
          <Tag
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-muted"
          />
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className={`${inputClass} appearance-none pr-10`}
            disabled={status === "loading"}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray-muted"
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="message" required>
          Message
        </FieldLabel>
        <div className="relative">
          <MessageSquare
            size={17}
            className="pointer-events-none absolute left-4 top-4 text-brand-gray-muted"
          />
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project or inquiry..."
            className={`${inputClass} resize-none pt-3.5`}
            disabled={status === "loading"}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-brand-white">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
