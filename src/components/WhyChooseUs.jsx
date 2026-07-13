const features = [
  {
    title: "Verified Specialists",
    description:
      "Every doctor is credential-checked and peer-reviewed before joining our platform.",
    cardBg: "bg-[#EFF6FF]",
    iconBg: "bg-[#DBEAFE]",
    iconColor: "text-[#1D4ED8]",
    accent: "bg-[#2563EB]",
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Instant Appointment Booking",
    description:
      "See real-time availability and book a slot with your preferred doctor in seconds.",
    cardBg: "bg-[#F5F3FF]",
    iconBg: "bg-[#EDE9FE]",
    iconColor: "text-[#7E22CE]",
    accent: "bg-[#7E22CE]",
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <path d="M16 2.5v4" />
        <path d="M8 2.5v4" />
        <path d="M3 9.5h18" />
        <path d="m9 14 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Secure Payments",
    description:
      "Pay consultation fees safely with encrypted, Stripe-powered checkout — every time.",
    cardBg: "bg-[#FFFBEB]",
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-[#B45309]",
    accent: "bg-[#F59E0B]",
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2.5" />
        <path d="M2 10h20" />
        <path d="M6 15h4" />
      </>
    ),
  },
  {
    title: "Digital Health Records",
    description:
      "Access your prescriptions, reports, and appointment history anytime, from anywhere.",
    cardBg: "bg-[#F0FDF4]",
    iconBg: "bg-[#DCFCE7]",
    iconColor: "text-[#15803D]",
    accent: "bg-[#10B981]",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6" />
        <path d="M9 17h6" />
      </>
    ),
  },
  {
    title: "24/7 Emergency Support",
    description:
      "Round-the-clock hotline and on-call specialists for whenever urgent care is needed.",
    cardBg: "bg-[#FEF2F2]",
    iconBg: "bg-[#FEE2E2]",
    iconColor: "text-[#DC2626]",
    accent: "bg-[#EF4444]",
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
    ),
  },
  {
    title: "Affordable Consultation",
    description:
      "Transparent, upfront pricing with no hidden charges — quality care that fits your budget.",
    cardBg: "bg-[#F0FDFA]",
    iconBg: "bg-[#CCFBF1]",
    iconColor: "text-[#0F766E]",
    accent: "bg-[#14B8A6]",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10" />
        <path d="M15 9.5c0-1.4-1.34-2.5-3-2.5s-3 1.1-3 2.5 1.34 2.5 3 2.5 3 1.1 3 2.5-1.34 2.5-3 2.5-3-1.1-3-2.5" />
      </>
    ),
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-bg-alt px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-bg-card px-4 py-1.5 text-xs font-bold tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            WHY CHOOSE US
          </div>
          <h2 className="mt-5 text-3xl font-extrabold text-heading sm:text-4xl">
            Why Choose MediCareConnect
          </h2>
          <p className="mt-3 text-paragraph">
            Everything you need for reliable, hassle-free healthcare — built
            around trust, speed, and your peace of mind.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl ${feature.cardBg} p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              {/* Top accent bar */}
              <span
                className={`absolute inset-x-0 top-0 h-1 ${feature.accent}`}
              />

              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} transition-transform group-hover:scale-110`}
              >
                <svg
                  className={`h-6 w-6 ${feature.iconColor}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {feature.icon}
                </svg>
              </span>

              <h3 className="mt-5 text-base font-bold text-heading">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-paragraph">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;