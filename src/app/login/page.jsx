"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(`/dashboard/${session.user.role}`);
    }
  }, [isPending, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const user = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const { data, error } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
    });

    if (data) {
      toast.success("Login successful!");
      router.push(`/dashboard/${data.user?.role}`);
    }
    if (error) {
      toast.error("Login failed!");
      setErrorMessage(
        error.message || "Your account has been suspended. Please contact support."
      );
    }

    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  if (isPending || session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-base-300 border-t-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 pb-10 pt-24 sm:px-6">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 shadow-xl lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-accent p-10 text-white lg:flex">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-base-100/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-base-100/10 blur-3xl" />

          <Link href="/" className="relative text-xl font-bold tracking-tight">
            Medi<span className="text-white/80">Care</span>
          </Link>

          <div className="relative">
            <h2 className="text-3xl font-extrabold leading-tight">
              Welcome back to better care.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85">
              Log in to manage your appointments, view your health records,
              and connect with your trusted doctors.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <p className="text-xs text-white/80">
                Trusted by 20,000+ patients
              </p>
            </div>
          </div>

          <p className="relative text-xs text-white/70">
            © {new Date().getFullYear()} MediCareConnect
          </p>
        </div>

        <div className="p-8 sm:p-10 lg:p-12">
          <h1 className="text-2xl font-extrabold text-base-content">Welcome back</h1>
          <p className="mt-1.5 text-sm text-base-content/60">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary">
              Sign up
            </Link>
          </p>

          {errorMessage && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
              <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
              {errorMessage}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-7 cursor-pointer flex w-full items-center justify-center gap-3 rounded-xl border border-base-300 bg-base-100 py-2.5 text-sm font-semibold text-base-content/80 transition-colors hover:bg-base-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.65Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.88-3c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.93H1.29v3.1A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.31 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.29a12 12 0 0 0 0 10.8l4.02-3.1Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.6l4.02 3.1C6.25 6.87 8.89 4.77 12 4.77Z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3">
            <span className="h-px flex-1 bg-base-300" />
            <span className="text-xs font-medium text-base-content/50">
              OR CONTINUE WITH EMAIL
            </span>
            <span className="h-px flex-1 bg-base-300" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <TextField name="email" type="email" isRequired>
              <Label className="text-sm font-medium text-base-content/80">Email Address</Label>
              <Input
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none transition-colors placeholder:text-base-content/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <FieldError className="mt-1 text-xs text-[#EF4444]" />
            </TextField>

            {/* Password */}
            <TextField name="password" isRequired>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-base-content/80">Password</Label>
                {/* <NextLink href="/forgot-password" className="text-xs font-semibold text-primary">
                  Forgot password?
                </NextLink> */}
              </div>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 pr-11 text-sm text-base-content outline-none transition-colors placeholder:text-base-content/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content/80"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6 0 10 7 10 7a17.7 17.7 0 0 1-2.94 3.94M6.5 6.5C3.6 8.28 2 12 2 12s4 7 10 7a9.4 9.4 0 0 0 4.16-.94M9.9 9.9a3 3 0 1 0 4.2 4.2" />
                      <path d="m2 2 20 20" />
                    </svg>
                  )}
                </button>
              </div>
              <FieldError className="mt-1 text-xs text-[#EF4444]" />
            </TextField>

            {/* Remember me */}
            {/* <label className="flex items-center gap-2 text-sm text-base-content/60">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-[#CBD5E1] text-primary focus:ring-primary/30"
              />
              Remember me for 30 days
            </label> */}

            {/* Submit */}
            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="w-full rounded-full bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Logging in…" : "Log In"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;