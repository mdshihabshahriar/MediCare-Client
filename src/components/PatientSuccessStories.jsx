import Image from "next/image";

const testimonials = [
  {
    quote:
      "Dr. Amanda Ross saved my father's life. Her precision, caring personality, and clear explanations made a stressful surgery very manageable. Highly recommended!",
    name: "Sarah Jenkins",
    role: "Consulted Patient",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5,
  },
  {
    quote:
      "Booking an appointment took less than two minutes, and the doctor actually had time to listen. This platform completely changed how I approach healthcare.",
    name: "Rafiq Ahmed",
    role: "Consulted Patient",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
  },
  {
    quote:
      "My daughter was terrified of doctors, but Dr. Wilson was so patient and gentle with her. We finally found a pediatrician we trust completely.",
    name: "Fatima Noor",
    role: "Consulted Patient",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
  },
  {
    quote:
      "The digital records feature meant my new specialist already had my full history before our first call. No repeating myself, no lost paperwork.",
    name: "James Carter",
    role: "Consulted Patient",
    avatar: "https://i.pravatar.cc/150?img=53",
    rating: 4,
  },
  {
    quote:
      "I was skeptical about online consultations, but the video quality and the doctor's attentiveness made it feel just like an in-person visit.",
    name: "Mitu Rahman",
    role: "Consulted Patient",
    avatar: "https://i.pravatar.cc/150?img=25",
    rating: 5,
  },
  {
    quote:
      "Transparent pricing before I even booked — no surprise bills afterward. That alone earned my trust for future visits.",
    name: "David Okafor",
    role: "Consulted Patient",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 5,
  },
];

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5 text-warning">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill={i < rating ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="group relative w-[380px] shrink-0 rounded-2xl border border-border bg-bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 sm:w-[420px]">
    {/* Watermark quote mark */}
    <svg
      className="absolute right-6 top-6 h-9 w-9 text-primary/10 transition-colors duration-300 group-hover:text-primary/20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M9.5 4C6.46 4 4 6.46 4 9.5c0 2.7 1.94 4.94 4.5 5.41V20H12v-6.5H9.5c-1.1 0-2-.9-2-2s.9-2 2-2H12V4H9.5zm9 0C15.46 4 13 6.46 13 9.5c0 2.7 1.94 4.94 4.5 5.41V20H21v-6.5h-2.5c-1.1 0-2-.9-2-2s.9-2 2-2H21V4h-2.5z" />
    </svg>

    <StarRow rating={testimonial.rating} />

    {/* Quote */}
    <p className="relative mt-4 text-sm leading-relaxed text-paragraph">
      &ldquo;{testimonial.quote}&rdquo;
    </p>

    {/* Patient */}
    <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/10">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <div>
          <p className="text-sm font-bold text-heading">{testimonial.name}</p>
          <p className="text-xs text-muted">{testimonial.role}</p>
        </div>
        <svg
          className="h-4 w-4 shrink-0 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-label="Verified patient"
        >
          <path d="M12 2 9.5 4.5 6 4l-1 3.5L1.5 9 3 12l-1.5 3L6 16l1 3.5 3.5-.5L12 22l2.5-2.5L18 20l1-3.5L22.5 15 21 12l1.5-3L19 7.5 18 4l-3.5.5L12 2Zm4.3 6.3-5 5-2.6-2.6 1.06-1.06L11.3 11.2l3.94-3.94 1.06 1.04Z" />
        </svg>
      </div>
    </div>
  </div>
);

const MarqueeRow = ({ items, speed = 55 }) => (
  <div
    className="flex w-max animate-marquee gap-6"
    style={{ animationDuration: `${speed}s` }}
  >
    {items.map((testimonial, index) => (
      <TestimonialCard key={index} testimonial={testimonial} />
    ))}
  </div>
);

const PatientSuccessStories = () => {
  // Duplicate the list so the marquee loop looks seamless
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden py-16">
      {/*
        Plain <style> (not styled-jsx) on purpose — styled-jsx injects a
        "jsx-xxxx" scoping class that can mismatch between the server and
        client render in the App Router and trigger a hydration error.
        A plain global stylesheet has no such class, so it's hydration-safe.
      */}
      <style>{`
        @keyframes patient-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation-name: patient-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation-play-state: paused;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-bg-card px-4 py-1.5 text-xs font-bold tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            PATIENT STORIES
          </div>
          <h2 className="mt-5 text-3xl font-extrabold text-heading sm:text-4xl">
            Real Patient Success Stories
          </h2>
          <p className="mt-3 text-paragraph">
            Hear directly from patients whose lives were changed by the
            doctors on our platform.
          </p>

          {/* Trust strip */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-1.5">
              <StarRow rating={5} />
              <span className="font-bold text-heading">4.9/5</span>
            </div>
            <span className="h-4 w-px bg-border" />
            <span>
              <span className="font-bold text-heading">12,000+</span> verified
              reviews
            </span>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div
        className="relative mt-14 overflow-hidden [&:hover>div]:[animation-play-state:paused]"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <MarqueeRow items={loop} speed={55} />
      </div>
    </section>
  );
};

export default PatientSuccessStories;