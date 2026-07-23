"use client";

import { useState } from "react";
import { TextField, Label, Input, TextArea, Button } from "@heroui/react";

const initialProfile = {
  qualifications: "MBBS, FCPS (Cardiology), Fellowship in Interventional Cardiology",
  experience: 12,
  consultationFee: 1500,
  availableSlots: ["Sunday 9:00–13:00", "Monday 9:00–13:00", "Monday 17:00–20:00", "Wednesday 10:00–14:00"],
};

export default function DoctorProfileManagement() {
  const [slots, setSlots] = useState(initialProfile.availableSlots);
  const [newSlot, setNewSlot] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
    const payload = {
      qualifications: formData.get("qualifications"),
      experience: Number(formData.get("experience")),
      consultationFee: Number(formData.get("consultationFee")),
      availableSlots: slots,
    };

    // TODO: send `payload` to your API.
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
          <TextField name="qualifications" defaultValue={initialProfile.qualifications} isRequired>
            <Label className="text-sm font-medium text-[#334155]">Qualifications</Label>
            <TextArea
              rows={3}
              defaultValue={initialProfile.qualifications}
              className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </TextField>

          <div className="grid grid-cols-2 gap-4">
            <TextField name="experience" type="number" defaultValue={initialProfile.experience} isRequired>
              <Label className="text-sm font-medium text-[#334155]">Experience (years)</Label>
              <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
            </TextField>
            <TextField name="consultationFee" type="number" defaultValue={initialProfile.consultationFee} isRequired>
              <Label className="text-sm font-medium text-[#334155]">Consultation Fee (৳)</Label>
              <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
            </TextField>
          </div>

          {/* Available slots */}
          <div>
            <Label className="text-sm font-medium text-[#334155]">Available Slots</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map((slot, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#2563EB]"
                >
                  {slot}
                  <button
                    type="button"
                    onClick={() => removeSlot(i)}
                    className="text-[#2563EB]/60 hover:text-[#2563EB]"
                    aria-label="Remove slot"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </span>
              ))}
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
              <button
                type="button"
                onClick={addSlot}
                className="shrink-0 rounded-xl border border-[#E2E8F0] px-4 text-sm font-semibold text-[#334155] hover:bg-[#F1F5F9]"
              >
                Add
              </button>
            </div>
            <p className="mt-1.5 text-xs text-[#94A3B8]">
              For recurring weekly slots with day-by-day control, use Manage Schedule instead.
            </p>
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