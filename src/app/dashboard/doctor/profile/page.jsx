"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { TextField, Label, Input, TextArea, Button } from "@heroui/react";

const specialties = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
];

const initialProfile = {
  photoUrl: "https://i.pravatar.cc/150?img=44",
  specialty: "Cardiology",
  experience: 12,
  qualifications: "MBBS, FCPS (Cardiology), Fellowship in Interventional Cardiology",
  consultationFee: 45,
  hospitalName: "Dhaka Medical College Hospital",
  availableSlots: ["Sunday 9:00–13:00", "Monday 9:00–13:00", "Monday 17:00–20:00", "Wednesday 10:00–14:00"],
};

// TODO: replace with your real upload call (S3 / Cloudinary / imgbb / etc.),
// same pattern as the Register page — only the returned URL is saved to the DB.
async function uploadPhotoAndGetUrl(file) {
  return "https://your-cdn.com/uploads/placeholder.jpg";
}

export default function DoctorProfileManagement() {
  const fileInputRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(initialProfile.photoUrl);
  const [slots, setSlots] = useState(initialProfile.availableSlots);
  const [newSlot, setNewSlot] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const addSlot = () => {
    if (!newSlot.trim()) return;
    setSlots((prev) => [...prev, newSlot.trim()]);
    setNewSlot("");
  };

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    const formData = new FormData(e.currentTarget);

    let photoUrl = initialProfile.photoUrl;
    if (photoFile) {
      photoUrl = await uploadPhotoAndGetUrl(photoFile);
    }

    const payload = {
      photoUrl,
      specialty: formData.get("specialty"),
      experience: Number(formData.get("experience")),
      qualifications: formData.get("qualifications"),
      consultationFee: Number(formData.get("consultationFee")),
      hospitalName: formData.get("hospitalName"),
      availableSlots: slots,
    };

    // TODO: PATCH `payload` to your API.
    console.log("Update doctor profile:", payload);

    setIsSaving(false);
    setIsSaved(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Profile Management</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Keep your professional details up to date for patients to see.
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
          {/* Profile Photo */}
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
                  <svg className="h-6 w-6 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0F172A]">
                  {photoFile ? photoFile.name : "Click to upload or drag and drop"}
                </p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">PNG or JPG, up to 5MB</p>
              </div>
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

          {/* Clinical Specialties */}
          <div>
            <Label className="text-sm font-medium text-[#334155]">Clinical Specialties</Label>
            <select
              name="specialty"
              required
              defaultValue={initialProfile.specialty}
              className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField name="experience" type="number" defaultValue={initialProfile.experience} isRequired>
              <Label className="text-sm font-medium text-[#334155]">Experience (Years)</Label>
              <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
            </TextField>
            <TextField name="consultationFee" type="number" defaultValue={initialProfile.consultationFee} isRequired>
              <Label className="text-sm font-medium text-[#334155]">Co-Pay Consultation Fee ($)</Label>
              <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
            </TextField>
          </div>

          {/* Qualifications Statement */}
          <TextField name="qualifications" defaultValue={initialProfile.qualifications} isRequired>
            <Label className="text-sm font-medium text-[#334155]">Qualifications Statement</Label>
            <TextArea
              rows={3}
              defaultValue={initialProfile.qualifications}
              className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </TextField>

          {/* Attached Medical Hospital Name */}
          <TextField name="hospitalName" defaultValue={initialProfile.hospitalName} isRequired>
            <Label className="text-sm font-medium text-[#334155]">Attached Medical Hospital Name</Label>
            <Input
              placeholder="e.g. Dhaka Medical College Hospital"
              className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </TextField>

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