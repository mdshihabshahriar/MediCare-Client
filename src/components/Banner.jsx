'use client';
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <section className="px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-banner-card px-6 py-14 sm:px-10 sm:py-16 lg:px-14 bg-[#2563EB]">
        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div>
        
            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl text-white">
              Quality Healthcare <br />
              <span className="text-sky-400">Just a Click Away</span>
            </h1>

            {/* Paragraph */}
            <p className="mt-6 max-w-md text-base leading-relaxed text-banner-paragraph sm:text-lg text-white font-semibold">
              Book appointments with trusted doctors, manage your health records and get the best medical care — all in one place.
            </p>

            {/* CTA */}
            <Link
              href="/find-doctors"
              className="btn bg-sky-500 text-white mt-9 inline-flex items-center gap-2 rounded-full bg-banner-cta px-6 py-6 text-sm font-bold text-banner-cta-text transition-colors hover:bg-banner-cta-hover sm:text-base border-none"
            >
              Find a Specialist
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
            </Link>
          </div>

          {/* Right: image */}
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
              {/* Replace src below with your own doctor/clinic photo */}
              <Image
                src="/assets/banner.jpg"
                alt="Doctor Image"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Floating status card */}
            <div className="absolute left-5 top-5 rounded-xl bg-banner-status-bg px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <span className="text-warning">★★★★★</span>
                <span className="text-accent">Active</span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-white">
                Clinical Schedulers Live
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;