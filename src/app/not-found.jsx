import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        {/* Icon */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#2563EB]/10 blur-xl" />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#EFF6FF]">
            <svg
              className="h-11 w-11 text-[#2563EB]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2v14a4 4 0 0 0 8 0V6a3 3 0 0 1 6 0v3" />
              <circle cx="20" cy="17.5" r="2.5" />
            </svg>
          </span>
        </div>

        {/* 404 */}
        <p className="mt-8 text-7xl font-extrabold tracking-tight text-[#2563EB] sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#64748B] sm:text-base">
          The page you&apos;re looking for may have been moved, renamed, or
          doesn&apos;t exist. Let&apos;s get you back on track.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] sm:w-auto"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              <path d="M9 22V12h6v10" />
            </svg>
            Back to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#2563EB] px-7 py-3 text-sm font-bold text-[#2563EB] transition-colors hover:bg-[#EFF6FF] sm:w-auto"
          >
            Contact Support
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#94A3B8]">
          Or try{" "}
          <Link href="/find-doctors" className="font-semibold text-[#2563EB]">
            finding a doctor
          </Link>{" "}
          instead.
        </p>
      </div>
    </main>
  );
}