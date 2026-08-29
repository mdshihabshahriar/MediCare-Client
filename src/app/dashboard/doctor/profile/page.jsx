"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TextField, Label, Input, TextArea, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const specialties = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Gynecology",
  "Ophthalmology",
  "Medicine",
  "ENT",
  "Psychiatry",
  "Urology",
  "Oncology",
];

const emptyProfile = {
  photoUrl: "",
  specialty: specialties[0],
  experience: "",
  qualifications: "",
  consultationFee: "",
  hospitalName: "",
  // availableSlots: [],
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

export default function DoctorProfileManagement() {
  const { data: session, isPending: isSessionPending, refetch: refetchSession } = authClient.useSession();

  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null); 
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  // const [slots, setSlots] = useState([]);
  // const [newSlot, setNewSlot] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    document.title = "Profile | MediCare";
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadProfile = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/doctors/${session.user.id}`,
          { headers: { authorization: `Bearer ${tokenData?.token}` } }
        );
        const existing = await res.json(); 
        const data = existing || emptyProfile;

        setProfile(data);
        setPhotoPreview(data.photoUrl || null);
        // setSlots(data.availableSlots || []);
      } catch (err) {
        console.error("Failed to load doctor profile:", err);
        setProfile(emptyProfile);
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

  // const addSlot = () => {
  //   if (!newSlot.trim()) return;
  //   setSlots((prev) => [...prev, newSlot.trim()]);
  //   setNewSlot("");
  // };

  // const removeSlot = (index) => {
  //   setSlots((prev) => prev.filter((_, i) => i !== index));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsSaving(true);
    setIsSaved(false);

    const formData = new FormData(e.currentTarget);

    let photoUrl = profile.photoUrl;
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
      // availableSlots: slots,
    };

    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors/${session.user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", authorization: `Bearer ${tokenData?.token}` },
          body: JSON.stringify(payload),
        }
      );
      toast.success("Profile updated successfully");

      if (!res.ok) throw new Error("Failed to save profile");

      setProfile(payload);
      setIsSaved(true);
      await refetchSession()
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  if (isSessionPending || profile === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-[#E2E8F0] border-t-[#2563EB]"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Profile Management</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Keep your professional details up to date for patients to see.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8"
      >
        <AnimatePresence>
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex items-center gap-2 overflow-hidden rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#15803D]"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m22 4-10 10-3-3" />
              </svg>
              Your profile has been saved.
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          key={profile.photoUrl}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
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
                  <Image src={photoPreview || null} alt="Profile preview" fill className="object-cover" />
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
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label className="text-sm font-medium text-[#334155]">Clinical Specialties</Label>
            <select
              name="specialty"
              required
              defaultValue={profile.specialty}
              className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <TextField name="experience" type="number" defaultValue={profile.experience} isRequired>
              <Label className="text-sm font-medium text-[#334155]">Experience (Years)</Label>
              <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
            </TextField>
            <TextField name="consultationFee" type="number" defaultValue={profile.consultationFee} isRequired>
              <Label className="text-sm font-medium text-[#334155]">Co-Pay Consultation Fee ($)</Label>
              <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
            </TextField>
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField name="qualifications" defaultValue={profile.qualifications} isRequired>
              <Label className="text-sm font-medium text-[#334155]">Qualifications Statement</Label>
              <TextArea
                rows={3}
                className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </TextField>
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField name="hospitalName" defaultValue={profile.hospitalName} isRequired>
              <Label className="text-sm font-medium text-[#334155]">Attached Medical Hospital Name</Label>
              <Input
                placeholder="e.g. Dhaka Medical College Hospital"
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </TextField>
          </motion.div>

          {/* Available slots */}
          {/* <div>
            <Label className="text-sm font-medium text-[#334155]">Available Slots</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map((slot, i) => (
                <span key={i} className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#2563EB]">
                  {slot}
                  <button type="button" onClick={() => removeSlot(i)} className="text-[#2563EB]/60 hover:text-[#2563EB]" aria-label="Remove slot">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {slots.length === 0 && (
                <p className="text-xs text-[#94A3B8]">No slots added yet.</p>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSlot();
                  }
                }}
                placeholder="e.g. Tuesday 15:00–18:00"
                className="flex-1 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
              <button type="button" onClick={addSlot} className="shrink-0 rounded-xl border border-[#E2E8F0] px-4 text-sm font-semibold text-[#334155] hover:bg-[#F1F5F9]">
                Add
              </button>
            </div>
            <p className="mt-1.5 text-xs text-[#94A3B8]">
              For recurring weekly slots with day-by-day control, use Manage Schedule instead.
            </p>
          </div> */}

          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-fit">
              <Button
                type="submit"
                isDisabled={isSaving}
                className="mt-2 w-fit rounded-full bg-[#2563EB] px-7 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
              >
                {isSaving ? "Saving…" : "Save Changes"}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}