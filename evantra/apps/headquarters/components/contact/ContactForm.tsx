"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type FormState = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setFormState("sending");
    setStatusMessage("");

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "We couldn't send your message. Please try again.");
      }

      form.reset();
      setFormState("sent");
      setStatusMessage("Thanks for reaching out. Your message has been sent to Evantra.");
    } catch (error) {
      setFormState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "We couldn't send your message. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="absolute -left-[10000px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium">First name</label>
          <input id="firstName" name="firstName" type="text" autoComplete="given-name" required maxLength={80} className="mt-2 w-full rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9aa3b3] focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10" placeholder="Your first name" />
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
          <input id="lastName" name="lastName" type="text" autoComplete="family-name" required maxLength={80} className="mt-2 w-full rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9aa3b3] focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10" placeholder="Your last name" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2 w-full rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9aa3b3] focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10" placeholder="you@example.com" />
      </div>

      <div>
        <label htmlFor="organization" className="text-sm font-medium">
          Organization <span className="ml-2 text-[#9aa3b3]">Optional</span>
        </label>
        <input id="organization" name="organization" type="text" autoComplete="organization" maxLength={160} className="mt-2 w-full rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9aa3b3] focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10" placeholder="Company or organization" />
      </div>

      <div>
        <label htmlFor="inquiryType" className="text-sm font-medium">Inquiry type</label>
        <select id="inquiryType" name="inquiryType" required defaultValue="" className="mt-2 w-full rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10">
          <option value="" disabled>Select an inquiry type</option>
          <option value="business">Business &amp; Partnerships</option>
          <option value="technology">Technology &amp; Engineering</option>
          <option value="research">Research &amp; Innovation</option>
          <option value="general">General Inquiry</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <textarea id="message" name="message" required minLength={10} maxLength={5000} rows={7} className="mt-2 w-full resize-y rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9aa3b3] focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10" placeholder="Tell us about your project, opportunity or inquiry..." />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[#10182c]/10 bg-white p-4">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#e6b24a]" />
        <p className="text-xs leading-5 text-[#53627b]">
          Please avoid submitting passwords, authentication tokens or other sensitive credentials through this form.
        </p>
      </div>

      <p aria-live="polite" role={formState === "error" ? "alert" : "status"} className={`text-sm ${formState === "error" ? "text-red-700" : "text-[#315d47]"}`}>
        {statusMessage}
      </p>
      {formState === "error" && (
        <p className="-mt-4 text-sm text-[#53627b]">
          You can also email us at{" "}
          <a className="font-medium text-[#0b4f71] underline" href="mailto:info@evantradebuckman.com">
            info@evantradebuckman.com
          </a>
          .
        </p>
      )}

      <button type="submit" disabled={formState === "sending"} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-6 py-4 text-sm font-semibold text-[#091522] transition hover:bg-[#f0c261] disabled:cursor-wait disabled:opacity-70">
        {formState === "sending" ? "Sending..." : formState === "sent" ? "Message sent" : "Send Inquiry"}
        {formState !== "sending" && <ArrowRight size={17} />}
      </button>
    </form>
  );
}
