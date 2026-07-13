"use client";

import { useEffect, useRef, useState } from "react";

/** Animates a number from 0 -> target once it scrolls into view. */
function useCountUp(target, { duration = 1800, decimals = 0 } = {}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setDisplay(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
            else setDisplay(target);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.floor(display).toLocaleString();

  return { ref, formatted };
}

const stats = [
  {
    label: "Total Doctors",
    target: 500,
    decimals: 0,
    suffix: "+",
    trend: "+12% this year",
    bg: "bg-stat-doctors",
    glow: "bg-blue-400/25",
    iconColor: "text-[#1D4ED8]",
    icon: (
      <>
        <path d="M9 3v2a3 3 0 0 0 6 0V3" />
        <path d="M6 5h12v4a6 6 0 0 1-12 0V5Z" />
        <path d="M9 15v2a3 3 0 0 0 6 0v-2" />
        <circle cx="18" cy="17" r="3" />
        <path d="M18 15.5v3" />
        <path d="m16.9 16.5 2.2 2" />
      </>
    ),
  },
  {
    label: "Total Patients",
    target: 20000,
    decimals: 0,
    suffix: "+",
    trend: "+2,400 this month",
    bg: "bg-stat-patients",
    glow: "bg-emerald-400/25",
    iconColor: "text-[#15803D]",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <circle cx="17.5" cy="9.5" r="2.8" />
        <path d="M15 20a5 5 0 0 1 7.5-4.33" />
      </>
    ),
  },
  {
    label: "Total Appointments",
    target: 50000,
    decimals: 0,
    suffix: "+",
    trend: "+6,100 this month",
    bg: "bg-stat-appointments",
    glow: "bg-purple-400/25",
    iconColor: "text-[#7E22CE]",
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
    label: "Total Reviews",
    target: 4.9,
    decimals: 1,
    suffix: "/5",
    trend: "2,000+ ratings",
    bg: "bg-stat-reviews",
    glow: "bg-amber-400/25",
    iconColor: "text-[#B45309]",
    icon: (
      <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
    ),
  },
];

const StatItem = ({ stat }) => {
  const { ref, formatted } = useCountUp(stat.target, {
    decimals: stat.decimals,
  });

  return (
    <div ref={ref} className="flex flex-col items-center px-6 py-12 text-center">
      {/* Icon with soft glow */}
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className={`absolute inset-0 rounded-full ${stat.glow} blur-lg`} />
        <span
          className={`relative flex h-14 w-14 items-center justify-center rounded-full ${stat.bg} shadow-sm`}
        >
          <svg
            className={`h-6 w-6 ${stat.iconColor}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {stat.icon}
          </svg>
        </span>
      </div>

      {/* Animated number */}
      <p className="mt-7 text-4xl font-extrabold tracking-tight text-heading tabular-nums sm:text-5xl">
        {formatted}
        <span className="text-primary">{stat.suffix}</span>
      </p>

      <p className="mt-2 text-sm font-medium text-paragraph">{stat.label}</p>

      {/* Trend badge */}
      <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-border bg-bg-section px-2.5 py-1 text-[11px] font-medium text-muted">
        <svg
          className="h-3 w-3 text-accent"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </svg>
        {stat.trend}
      </span>
    </div>
  );
};

const PlatformStatistics = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-hero px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        {/* Subtle dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(15,23,42,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Decorative glow blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative">
          {/* Section header */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-bg-card px-4 py-1.5 text-xs font-bold tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              OUR IMPACT
            </div>
            <h2 className="mt-5 text-3xl font-extrabold text-heading sm:text-4xl">
              Trusted by Thousands, Every Day
            </h2>
            <p className="mt-3 text-paragraph">
              Real numbers from a growing community of doctors and patients
              who rely on us for reliable healthcare.
            </p>
          </div>

          {/* Stat bar */}
          <div className="mt-14 grid grid-cols-2 divide-y divide-border rounded-2xl border border-border bg-bg-card/80 shadow-sm backdrop-blur-sm sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <StatItem key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformStatistics;