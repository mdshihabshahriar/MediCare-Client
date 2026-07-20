"use client";

import { useState } from "react";
import { TextField, Label, Input, TextArea, FieldError, Button } from "@heroui/react";

const contactInfo = [
  {
    title: "Our Location",
    lines: ["House 12, Road 5, Dhanmondi", "Dhaka 1209, Bangladesh"],
    bg: "bg-[#DBEAFE]",
    iconColor: "text-[#1D4ED8]",
    icon: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    title: "Email Us",
    lines: ["support@medicareconnect.com", "partners@medicareconnect.com"],
    bg: "bg-[#DCFCE7]",
    iconColor: "text-[#15803D]",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </>
    ),
  },
  {
    title: "Call Us",
    lines: ["+880 2-912-345-678", "Sat–Thu, 9am – 8pm"],
    bg: "bg-[#F3E8FF]",
    iconColor: "text-[#7E22CE]",
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
    ),
  },
];

const faqs = [
  {
    q: "How quickly will I get a response?",
    a: "Our support team typically replies within 2–4 hours during business hours, and within 24 hours otherwise.",
  },
  {
    q: "Can I request a specific doctor?",
    a: "Yes — search by name, specialization, or location on the Find Doctors page and book directly with your preferred specialist.",
  },
  {
    q: "Is my information kept private?",
    a: "Absolutely. All messages and health records are encrypted and only accessible to you and your care team.",
  },
];

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    console.log("Contact payload:", payload);
    // TODO: send `payload` to your API / server action here.

    setIsSubmitting(false);
    setIsSubmitted(true);
    e.currentTarget.reset();
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-24">
      {/* Page hero */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-bold tracking-widest text-[#2563EB]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            CONTACT US
          </div>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[#0F172A] sm:text-5xl">
            We&apos;d love to <span className="text-[#2563EB]">hear from you</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#64748B]">
            Questions about booking, billing, or partnering with us? Our team
            is here to help.
          </p>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-3">
          {contactInfo.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg}`}>
                <svg className={`h-5 w-5 ${item.iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon}
                </svg>
              </span>
              <h3 className="mt-4 text-sm font-bold text-[#0F172A]">{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line} className="mt-1 text-sm text-[#64748B]">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Form + Emergency + FAQ */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact form */}
          <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-8 shadow-sm sm:p-10 lg:col-span-2">
            <h2 className="text-2xl font-extrabold text-[#0F172A]">Send us a message</h2>
            <p className="mt-1.5 text-sm text-[#64748B]">
              Fill out the form and we&apos;ll get back to you within 24 hours.
            </p>

            {isSubmitted && (
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#15803D]">
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m22 4-10 10-3-3" />
                </svg>
                Thanks! Your message has been sent — we&apos;ll be in touch soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <TextField name="name" isRequired>
                  <Label className="text-sm font-medium text-[#334155]">Full Name</Label>
                  <Input
                    placeholder="Sarah Jenkins"
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                  <FieldError className="mt-1 text-xs text-[#EF4444]" />
                </TextField>

                <TextField name="email" type="email" isRequired>
                  <Label className="text-sm font-medium text-[#334155]">Email Address</Label>
                  <Input
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                  <FieldError className="mt-1 text-xs text-[#EF4444]" />
                </TextField>
              </div>

              <TextField name="subject" isRequired>
                <Label className="text-sm font-medium text-[#334155]">Subject</Label>
                <Input
                  placeholder="How can we help?"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
                <FieldError className="mt-1 text-xs text-[#EF4444]" />
              </TextField>

              <TextField name="message" isRequired>
                <Label className="text-sm font-medium text-[#334155]">Message</Label>
                <TextArea
                  placeholder="Tell us more about your question..."
                  rows={5}
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
                <FieldError className="mt-1 text-xs text-[#EF4444]" />
              </TextField>

              <Button
                type="submit"
                isDisabled={isSubmitting}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2563EB] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Send Message"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Button>
            </form>
          </div>

          {/* Sidebar: Emergency + FAQ */}
          <div className="flex flex-col gap-6">
            {/* Emergency hotline */}
            <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EF4444]/30" />
                  <svg className="relative h-5 w-5 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-medium text-[#B91C1C]">24/7 Emergency Hotline</p>
                  <p className="text-xl font-extrabold text-[#0F172A]">999</p>
                </div>
              </div>
              <a
                href="tel:999"
                className="mt-4 block w-full rounded-full bg-[#EF4444] py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#DC2626]"
              >
                Call Now
              </a>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
              <h3 className="text-sm font-bold text-[#0F172A]">Quick Answers</h3>
              <div className="mt-4 flex flex-col divide-y divide-[#E2E8F0]">
                {faqs.map((faq) => (
                  <div key={faq.q} className="py-4 first:pt-0 last:pb-0">
                    <p className="text-sm font-semibold text-[#0F172A]">{faq.q}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;