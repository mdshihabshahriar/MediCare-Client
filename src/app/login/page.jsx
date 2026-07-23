"use client";

import { useState } from "react";
import Link from "next/link";
import { TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const user = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const {data, error} = await authClient.signIn.email({
      email: user.email,
      password: user.password,
    })

    console.log(data, error);

    if(data)
    {
      redirect("/")
    }
    if(error)
    {
      alert(error.message)
    }

    setIsSubmitting(false);
  };

  const handleGoogleLogin = () => {
    // TODO: trigger your Google OAuth flow here, e.g.:
    // signIn("google");
    console.log("Google login clicked");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 pb-10 pt-24 sm:px-6">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-white shadow-xl lg:grid-cols-2">
        {/* Left: accent banner */}
        <div className="relative hidden flex-col justify-between bg-accent p-10 text-white lg:flex">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

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
              {["A", "B", "C"].map((letter) => (
                <div
                  key={letter}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 text-xs font-semibold"
                >
                  {letter}
                </div>
              ))}
              <p className="text-xs text-white/80">
                Trusted by 20,000+ patients
              </p>
            </div>
          </div>

          <p className="relative text-xs text-white/70">
            © {new Date().getFullYear()} MediCareConnect
          </p>
        </div>

        {/* Right: form */}
        <div className="p-8 sm:p-10 lg:p-12">
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Welcome back</h1>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[#2563EB]">
              Sign up
            </Link>
          </p>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-[#E2E8F0] bg-white py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC]"
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
            <span className="h-px flex-1 bg-[#E2E8F0]" />
            <span className="text-xs font-medium text-[#94A3B8]">
              OR CONTINUE WITH EMAIL
            </span>
            <span className="h-px flex-1 bg-[#E2E8F0]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <TextField name="email" type="email" isRequired>
              <Label className="text-sm font-medium text-[#334155]">Email Address</Label>
              <Input
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
              <FieldError className="mt-1 text-xs text-[#EF4444]" />
            </TextField>

            {/* Password */}
            <TextField name="password" isRequired>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-[#334155]">Password</Label>
                {/* <NextLink href="/forgot-password" className="text-xs font-semibold text-[#2563EB]">
                  Forgot password?
                </NextLink> */}
              </div>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 pr-11 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155]"
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
            {/* <label className="flex items-center gap-2 text-sm text-[#64748B]">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/30"
              />
              Remember me for 30 days
            </label> */}

            {/* Submit */}
            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="w-full rounded-full bg-[#2563EB] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
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