"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TextField, Label, Input, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const emptyProfile = {
  name: "",
  email: "",
  gender: "male",
  photoUrl: "",
};

async function uploadPhotoAndGetUrl(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error("Image upload failed");
  }

  return data.data.url;
}

export default function MyProfile() {
  const {
    data: session,
    isPending: isSessionPending,
    refetch: refetchSession,
  } = authClient.useSession();

  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadProfile = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`;
        const res = await fetch(url);

        if (!res.ok) {
          const text = await res.text();
          console.error("Load profile error:", res.status, text.slice(0, 200));
          throw new Error(`HTTP ${res.status}`);
        }

        const existing = await res.json();
        const data = existing || {
          ...emptyProfile,
          name: session.user.name || "",
          email: session.user.email || "",
        };

        setProfile(data);
        setPhotoPreview(data.photoUrl || null);
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile data");
        setProfile({
          ...emptyProfile,
          name: session.user.name || "",
          email: session.user.email || "",
        });
      }
    };

    loadProfile();
  }, [session?.user?.id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsSaving(true);
    setIsSaved(false);

    const formData = new FormData(e.currentTarget);

    let photoUrl = profile.photoUrl;
    if (photoFile) {
      try {
        photoUrl = await uploadPhotoAndGetUrl(photoFile);
      } catch (err) {
        console.error(err);
        toast.error("Photo upload failed");
        setIsSaving(false);
        return;
      }
    }

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      gender: formData.get("gender"),
      photoUrl,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Save profile error:", res.status, text.slice(0, 200));
        throw new Error(`HTTP ${res.status}`);
      }

      toast.success("Profile updated successfully");
      setProfile(payload);
      setPhotoFile(null);
      setIsSaved(true);
      await refetchSession();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSessionPending || profile === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Update your personal information and profile photo.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
        {isSaved && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#15803D]">
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m22 4-10 10-3-3" />
            </svg>
            Your profile has been updated.
          </div>
        )}

        <form
          key={profile.photoUrl}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Photo */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F1F5F9] ring-1 ring-[#E2E8F0]">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt={profile.name || "Profile"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-[#94A3B8]">
                  {profile.name?.[0]?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-semibold text-[#0F172A] transition-colors hover:bg-[#F1F5F9]"
              >
                Change photo
              </button>
              <p className="mt-1.5 text-xs text-[#94A3B8]">
                PNG or JPG, up to 5MB
              </p>
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

          <TextField name="name" defaultValue={profile.name} isRequired>
            <Label className="text-sm font-medium text-[#334155]">
              Full Name
            </Label>
            <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
          </TextField>

          <TextField
            name="email"
            type="email"
            defaultValue={profile.email}
            isRequired
          >
            <Label className="text-sm font-medium text-[#334155]">
              Email Address
            </Label>
            <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
          </TextField>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-[#334155]">
                Gender
              </Label>
              <select
                name="gender"
                defaultValue={profile.gender}
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium text-[#334155]">
                Account Type
              </Label>
              <div className="mt-1.5 flex h-10.5 items-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#94A3B8]">
                {session.user.role}
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