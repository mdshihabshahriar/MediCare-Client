import Link from "next/link";

export default function VerificationPendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#F59E0B]/10 blur-xl" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#FFFBEB]">
            <svg className="h-9 w-9 text-[#B45309]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </span>
        </div>

        <h1 className="mt-7 text-2xl font-extrabold text-base-content sm:text-3xl">
          Your account is under review
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-base-content/60">
          Thanks for registering as a doctor. Our admin team verifies every
          doctor&apos;s credentials before they can appear on the platform —
          this usually takes 24–48 hours. We&apos;ll notify you by email as
          soon as you&apos;re approved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
        >
          Back to Homepage
        </Link>
      </div>
    </main>
  );
}