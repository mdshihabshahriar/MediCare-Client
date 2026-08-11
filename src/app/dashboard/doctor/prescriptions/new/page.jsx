"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, Label, Input, TextArea, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

function MedicineRows({ medicines, setMedicines }) {
  const updateRow = (index, field, value) => {
    setMedicines((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };
  const removeRow = (index) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {medicines.map((med, i) => (
        <div key={i} className="grid grid-cols-1 gap-2 rounded-xl border border-[#E2E8F0] p-4 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
          <input
            value={med.name}
            onChange={(e) => updateRow(i, "name", e.target.value)}
            placeholder="Medicine name"
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
          />
          <input
            value={med.dosage}
            onChange={(e) => updateRow(i, "dosage", e.target.value)}
            placeholder="Dosage (e.g. 1 tab twice daily)"
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
          />
          <input
            value={med.duration}
            onChange={(e) => updateRow(i, "duration", e.target.value)}
            placeholder="Duration (e.g. 7 days)"
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="flex items-center justify-center rounded-lg p-2 text-[#94A3B8] hover:bg-[#FEF2F2] hover:text-[#EF4444] sm:w-10"
            aria-label="Remove medicine"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setMedicines((prev) => [...prev, { name: "", dosage: "", duration: "" }])}
        className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[#2563EB]"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Add medication
      </button>
    </div>
  );
}

export default function CreatePrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [appointment, setAppointment] = useState(null);
  const [loadingAppointment, setLoadingAppointment] = useState(Boolean(appointmentId));
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!appointmentId) return;

    const loadAppointment = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`);
        const data = await res.json();
        setAppointment(data);
      } catch (err) {
        console.error("Failed to load appointment:", err);
      } finally {
        setLoadingAppointment(false);
      }
    };

    loadAppointment();
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const newPrescription = {
      doctorId: session.user.id,
      patientId: appointment?.patientId || null,
      appointmentId: appointmentId || null,
      patient: appointment?.patient?.name || formData.get("patient"),
      diagnosis: formData.get("diagnosis"),
      advice: formData.get("advice"),
      medicines: medicines.filter((m) => m.name.trim() !== ""),
    };

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrescription),
      });
      toast.success("Prescription issued successfully");

      router.push("/dashboard/doctor/prescriptions");
    } catch (err) {
      console.error("Failed to issue prescription:", err);
      alert("Something went wrong while issuing the prescription.");
      setIsSubmitting(false);
    }
  };

  if (isSessionPending || loadingAppointment) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2563EB]" />
      </div>
    );
  }

  const patientName = appointment?.patient?.name || "Unknown Patient";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Generate Digital Rx</h1>
          <p className="mt-0.5 text-sm text-[#64748B]">
            Patient:{" "}
            <span className="font-semibold text-[#0F172A]">{patientName}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#E2E8F0] bg-white p-7 shadow-sm sm:p-8">
        <div className="flex flex-col gap-7">
          <TextField name="diagnosis" isRequired>
            <Label className="text-sm font-bold uppercase tracking-wide text-[#334155]">
              Clinical Diagnosis
            </Label>
            <Input
              placeholder="e.g. Acute viral pharyngitis"
              className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </TextField>

          <div>
            <Label className="text-sm font-bold uppercase tracking-wide text-[#334155]">
              Medications &amp; Instructions
            </Label>
            <div className="mt-1.5">
              <MedicineRows medicines={medicines} setMedicines={setMedicines} />
            </div>
          </div>

          <TextField name="advice">
            <Label className="text-sm font-bold uppercase tracking-wide text-[#334155]">
              Advisory Notes
            </Label>
            <TextArea
              rows={4}
              placeholder="Follow-up instructions, dietary advice, warning signs to watch for..."
              className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </TextField>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#E2E8F0] pt-6 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-full border border-[#E2E8F0] py-3 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC]"
          >
            Cancel
          </button>
          <Button
            type="submit"
            isDisabled={isSubmitting}
            className="flex-1 rounded-full bg-[#2563EB] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
          >
            {isSubmitting ? "Issuing…" : "Issue Digital Prescription"}
          </Button>
        </div>
      </form>
    </div>
  );
}