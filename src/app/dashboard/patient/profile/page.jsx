"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { TextField, Label, Input, Button } from "@heroui/react";

const initialUser = {
  name: "Sarah Jenkins",
  email: "sarah.jenkins@example.com",
  gender: "female",
  role: "Patient",
  photoUrl: "https://i.pravatar.cc/150?img=47",
};

export default function MyProfile() {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(initialUser.photoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      gender: formData.get("gender"),
    };

    // TODO: send `payload` (and the new photo, if changed) to your API.
    console.log("Update profile:", payload);

    setIsSaving(false);
    setIsSaved(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">My Profile</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Update your personal information and profile photo.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
        {isSaved && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#15803D]">
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m22 4-10 10-3-3" />
            </svg>
            Your profile has been updated.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Photo */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-[#E2E8F0]">
              <Image src={photoPreview} alt={initialUser.name} fill className="object-cover" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-semibold text-[#0F172A] transition-colors hover:bg-[#F1F5F9]"
              >
                Change photo
              </button>
              <p className="mt-1.5 text-xs text-[#94A3B8]">PNG or JPG, up to 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          <TextField name="name" defaultValue={initialUser.name} isRequired>
            <Label className="text-sm font-medium text-[#334155]">Full Name</Label>
            <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
          </TextField>

          <TextField name="email" type="email" defaultValue={initialUser.email} isRequired>
            <Label className="text-sm font-medium text-[#334155]">Email Address</Label>
            <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
          </TextField>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-[#334155]">Gender</Label>
              <select
                name="gender"
                defaultValue={initialUser.gender}
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium text-[#334155]">Account Type</Label>
              <div className="mt-1.5 flex h-10.5 items-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#94A3B8]">
                {initialUser.role}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            isDisabled={isSaving}
            className="mt-2 w-fit rounded-full bg-[#2563EB] px-7 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}