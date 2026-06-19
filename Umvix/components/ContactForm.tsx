"use client";

import { useState } from "react";
import {
  Building2,
  ChevronDown,
  Mail,
  MessageSquare,
  Tag,
  User,
} from "lucide-react";

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

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Thank you for your message! This is a static demo, so no data was actually sent."
    );
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
              placeholder="John Doe"
              className={inputClass}
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
              placeholder="john@example.com"
              className={inputClass}
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
            placeholder="Your Company Name"
            className={inputClass}
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
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary mt-2 w-full rounded-xl py-4 text-sm font-semibold"
      >
        Send Message
      </button>
    </form>
  );
}
