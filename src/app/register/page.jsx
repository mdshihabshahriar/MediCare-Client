"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TextField,
  Label,
  Input,
  FieldError,
  RadioGroup,
  Radio,
  Button,
} from "@heroui/react";

async function uploadPhotoAndGetUrl(file) {
    // Simulate an upload delay
  return "https://your-cdn.com/uploads/placeholder.jpg";
}

const RegisterPage = () => {
  const fileInputRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("patient");
  const [gender, setGender] = useState("female");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    let photoUrl = "";

    if (photoFile) {
      photoUrl = await uploadPhotoAndGetUrl(photoFile);
    }

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role,
      gender,
      photoUrl, // <- only the URL string goes to the database
    };

    console.log("Register payload:", payload);
    // TODO: send `payload` to your API / server action here.

    setIsSubmitting(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 pb-10 pt-24 sm:px-6">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-white shadow-xl lg:grid-cols-2">
        {/* Left: accent banner */}
        <div className="relative hidden flex-col justify-between bg-accent p-10 text-white lg:flex">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <Link href="/" className="relative text-xl font-bold tracking-tight">
            MediCare<span className="text-white/80">Connect</span>
          </Link>

          <div className="relative">
            <h2 className="text-3xl font-extrabold leading-tight">
              Join thousands getting better care, faster.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85">
              Create your account to book verified specialists, manage
              appointments, and keep your health records in one secure place.
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

        {/* Right: form */}
        <div className="p-8 sm:p-10 lg:p-12">
          <h1 className="text-2xl font-extrabold text-[#0F172A]">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#2563EB]">
              Log in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            {/* Photo upload */}
            <div>
              <label className="text-sm font-medium text-[#334155]">Profile Photo</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    setPhotoFile(file);
                    setPhotoPreview(URL.createObjectURL(file));
                  }
                }}
                className="mt-1.5 flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 transition-colors hover:border-[#2563EB] hover:bg-[#EFF6FF]"
              >
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[#E2E8F0]">
                  {photoPreview ? (
                    <Image src={photoPreview} alt="Profile preview" fill className="object-cover" />
                  ) : (
                    <svg
                      className="h-6 w-6 text-[#94A3B8]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {photoPreview ? photoFile?.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">PNG or JPG, up to 5MB</p>
                </div>

                {photoPreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoFile(null);
                      setPhotoPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="shrink-0 rounded-full p-1.5 text-[#94A3B8] transition-colors hover:bg-white hover:text-[#EF4444]"
                    aria-label="Remove photo"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  name="photo"
                  accept="image/png, image/jpeg"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name */}
            <TextField name="name" isRequired>
              <Label className="text-sm font-medium text-[#334155]">Full Name</Label>
              <Input
                placeholder="Sarah Jenkins"
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
              <FieldError className="mt-1 text-xs text-[#EF4444]" />
            </TextField>

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
              <Label className="text-sm font-medium text-[#334155]">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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

            {/* User role */}
            <RadioGroup value={role} onChange={setRole}>
              <Label className="text-sm font-medium text-[#334155]">I am a</Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Radio
                  value="patient"
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm font-semibold text-[#334155] outline-none transition-colors data-[selected=true]:border-[#2563EB] data-[selected=true]:bg-[#EFF6FF] data-[selected=true]:text-[#2563EB]"
                >
                  <Radio.Control className="hidden">
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>Patient</Radio.Content>
                </Radio>
                <Radio
                  value="doctor"
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm font-semibold text-[#334155] outline-none transition-colors data-[selected=true]:border-[#2563EB] data-[selected=true]:bg-[#EFF6FF] data-[selected=true]:text-[#2563EB]"
                >
                  <Radio.Control className="hidden">
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>Doctor</Radio.Content>
                </Radio>
              </div>
            </RadioGroup>

            {/* Gender */}
            <RadioGroup value={gender} onChange={setGender}>
              <Label className="text-sm font-medium text-[#334155]">Gender</Label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                <Radio
                  value="male"
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium text-[#334155] outline-none transition-colors data-[selected=true]:border-[#2563EB] data-[selected=true]:bg-[#EFF6FF] data-[selected=true]:text-[#2563EB]"
                >
                  <Radio.Control className="hidden">
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>Male</Radio.Content>
                </Radio>
                <Radio
                  value="female"
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium text-[#334155] outline-none transition-colors data-[selected=true]:border-[#2563EB] data-[selected=true]:bg-[#EFF6FF] data-[selected=true]:text-[#2563EB]"
                >
                  <Radio.Control className="hidden">
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>Female</Radio.Content>
                </Radio>
                <Radio
                  value="other"
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium text-[#334155] outline-none transition-colors data-[selected=true]:border-[#2563EB] data-[selected=true]:bg-[#EFF6FF] data-[selected=true]:text-[#2563EB]"
                >
                  <Radio.Control className="hidden">
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>Other</Radio.Content>
                </Radio>
              </div>
            </RadioGroup>

            {/* Submit */}
            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-[#2563EB] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
            >
              {isSubmitting ? "Creating account…" : "Create Account"}
            </Button>

            <p className="text-center text-xs text-[#94A3B8]">
              By creating an account, you agree to our{" "}
              <Link href="" className="font-medium text-[#334155] hover:text-[#2563EB]">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="" className="font-medium text-[#334155] hover:text-[#2563EB]">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;