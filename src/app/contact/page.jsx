"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TextField, Label, Input, TextArea, FieldError, Button } from "@heroui/react";

const contactInfo = [
  {
    title: "Our Location",
    lines: ["House 12, Road 5, Dhanmondi", "Dhaka 1209, Bangladesh"],
    bg: "bg-info/10",
    iconColor: "text-info",
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
    bg: "bg-success/10",
    iconColor: "text-success",
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
    bg: "bg-secondary/10",
    iconColor: "text-secondary",
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

    setIsSubmitting(false);
    setIsSubmitted(true);
    e.currentTarget.reset();
  };

  useEffect(() => {
    document.title = "Contact | MediCare";
  }, []);

  return (
    <main className="min-h-screen bg-base-200 pt-24">
      {/* Page hero */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-1.5 text-xs font-bold tracking-widest text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            CONTACT US
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 text-4xl font-extrabold leading-tight text-base-content sm:text-5xl"
          >
            We&apos;d love to <span className="text-primary">hear from you</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-base-content/60"
          >
            Questions about booking, billing, or partnering with us? Our team
            is here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-3">
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg}`}>
                <svg
                  className={`h-5 w-5 ${item.iconColor}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {item.icon}
                </svg>
              </span>
              <h3 className="mt-4 text-sm font-bold text-base-content">{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line} className="mt-1 text-sm text-base-content/60">
                  {line}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Emergency + FAQ */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-base-300 bg-base-100 p-8 shadow-sm sm:p-10 lg:col-span-2"
          >
            <h2 className="text-2xl font-extrabold text-base-content">Send us a message</h2>
            <p className="mt-1.5 text-sm text-base-content/60">
              Fill out the form and we&apos;ll get back to you within 24 hours.
            </p>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-6 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success"
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m22 4-10 10-3-3" />
                </svg>
                Thanks! Your message has been sent — we&apos;ll be in touch soon.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <TextField name="name" isRequired>
                  <Label className="text-sm font-medium text-base-content/80">Full Name</Label>
                  <Input
                    placeholder="Sarah Jenkins"
                    className="mt-1.5 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none transition-colors placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <FieldError className="mt-1 text-xs text-error" />
                </TextField>

                <TextField name="email" type="email" isRequired>
                  <Label className="text-sm font-medium text-base-content/80">Email Address</Label>
                  <Input
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none transition-colors placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <FieldError className="mt-1 text-xs text-error" />
                </TextField>
              </div>

              <TextField name="subject" isRequired>
                <Label className="text-sm font-medium text-base-content/80">Subject</Label>
                <Input
                  placeholder="How can we help?"
                  className="mt-1.5 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none transition-colors placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <FieldError className="mt-1 text-xs text-error" />
              </TextField>

              <TextField name="message" isRequired>
                <Label className="text-sm font-medium text-base-content/80">Message</Label>
                <TextArea
                  placeholder="Tell us more about your question..."
                  rows={5}
                  className="mt-1.5 w-full resize-none rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none transition-colors placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <FieldError className="mt-1 text-xs text-error" />
              </TextField>

              <Button
                type="submit"
                isDisabled={isSubmitting}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-content transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Send Message"}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Button>
            </form>
          </motion.div>

          {/* Sidebar: Emergency + FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Emergency hotline */}
            <div className="rounded-2xl border border-error/30 bg-error/10 p-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/20">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error/30" />
                  <svg
                    className="relative h-5 w-5 text-error"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-medium text-error">24/7 Emergency Hotline</p>
                  <p className="text-xl font-extrabold text-base-content">999</p>
                </div>
              </div>
              <a
                href="tel:999"
                className="mt-4 block w-full rounded-full bg-error py-2.5 text-center text-sm font-bold text-error-content transition-colors hover:bg-error/90"
              >
                Call Now
              </a>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <h3 className="text-sm font-bold text-base-content">Quick Answers</h3>
              <div className="mt-4 flex flex-col divide-y divide-base-300">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.q}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <p className="text-sm font-semibold text-base-content">{faq.q}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-base-content/60">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;