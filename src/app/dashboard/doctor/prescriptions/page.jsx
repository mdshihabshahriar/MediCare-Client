"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TextField, Label, Input, TextArea, Button } from "@heroui/react";

const initialPrescriptions = [
  {
    id: "1",
    patient: "David Okafor",
    date: "2026-07-25",
    diagnosis: "Seasonal allergic rhinitis",
    medicines: [
      { name: "Cetirizine 10mg", dosage: "1 tablet at night", duration: "7 days" },
      { name: "Fluticasone Nasal Spray", dosage: "2 sprays each nostril", duration: "14 days" },
    ],
    advice: "Avoid dust exposure. Return if symptoms persist beyond 2 weeks.",
  },
];

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function MedicineRows({ medicines, setMedicines }) {
  const updateRow = (index, field, value) => {
    setMedicines((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };
  const removeRow = (index) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Label className="text-sm font-medium text-[#334155]">Medicines</Label>
      <div className="mt-1.5 flex flex-col gap-3">
        {medicines.map((med, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 rounded-xl border border-[#E2E8F0] p-3">
            <input
              value={med.name}
              onChange={(e) => updateRow(i, "name", e.target.value)}
              placeholder="Medicine name"
              className="col-span-3 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#2563EB] sm:col-span-1"
            />
            <input
              value={med.dosage}
              onChange={(e) => updateRow(i, "dosage", e.target.value)}
              placeholder="Dosage"
              className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
            />
            <div className="flex gap-2">
              <input
                value={med.duration}
                onChange={(e) => updateRow(i, "duration", e.target.value)}
                placeholder="Duration"
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="shrink-0 rounded-lg p-2 text-[#94A3B8] hover:bg-[#FEF2F2] hover:text-[#EF4444]"
                aria-label="Remove medicine"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setMedicines((prev) => [...prev, { name: "", dosage: "", duration: "" }])}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB]"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Add medicine
      </button>
    </div>
  );
}

function PrescriptionForm({ initial, onSubmit, onCancel }) {
  const [medicines, setMedicines] = useState(
    initial?.medicines?.length ? initial.medicines : [{ name: "", dosage: "", duration: "" }]
  );

  return (
    <form onSubmit={(e) => onSubmit(e, medicines)} className="flex flex-col gap-5">
      <TextField name="patient" defaultValue={initial?.patient} isRequired>
        <Label className="text-sm font-medium text-[#334155]">Patient Name</Label>
        <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
      </TextField>

      <TextField name="diagnosis" defaultValue={initial?.diagnosis} isRequired>
        <Label className="text-sm font-medium text-[#334155]">Diagnosis</Label>
        <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
      </TextField>

      <MedicineRows medicines={medicines} setMedicines={setMedicines} />

      <TextField name="advice" defaultValue={initial?.advice}>
        <Label className="text-sm font-medium text-[#334155]">Advice / Notes</Label>
        <TextArea
          rows={3}
          defaultValue={initial?.advice}
          className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
        />
      </TextField>

      <div className="mt-1 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]"
        >
          Cancel
        </button>
        <Button type="submit" className="flex-1 rounded-full bg-[#2563EB] py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]">
          {initial ? "Save Changes" : "Create Prescription"}
        </Button>
      </div>
    </form>
  );
}

export default function PrescriptionManagement() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  // Auto-open the create form if we arrived here from "Mark Completed".
  const [isCreating, setIsCreating] = useState(Boolean(appointmentId));
  const [editTarget, setEditTarget] = useState(null);

  const handleCreate = (e, medicines) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPrescription = {
      id: crypto.randomUUID(),
      patient: formData.get("patient"),
      diagnosis: formData.get("diagnosis"),
      advice: formData.get("advice"),
      medicines: medicines.filter((m) => m.name.trim() !== ""),
      date: new Date().toISOString().slice(0, 10),
      // appointmentId, // TODO: link back to the appointment on your API
    };
    // TODO: POST `newPrescription` (with appointmentId) to your API.
    setPrescriptions((prev) => [newPrescription, ...prev]);
    setIsCreating(false);
  };

  const handleUpdate = (e, medicines) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      patient: formData.get("patient"),
      diagnosis: formData.get("diagnosis"),
      advice: formData.get("advice"),
      medicines: medicines.filter((m) => m.name.trim() !== ""),
    };
    // TODO: PATCH the prescription on your API.
    setPrescriptions((prev) => prev.map((p) => (p.id === editTarget.id ? { ...p, ...updated } : p)));
    setEditTarget(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Prescription Management</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Create and update prescriptions for your patients.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Create Prescription
        </button>
      </div>

      {appointmentId && (
        <div className="flex items-center gap-2 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-sm text-[#1D4ED8]">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          Creating a prescription for appointment #{appointmentId}.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {prescriptions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center text-sm text-[#94A3B8]">
            No prescriptions yet.
          </div>
        ) : (
          prescriptions.map((rx) => (
            <div key={rx.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">{rx.patient}</p>
                  <p className="text-xs text-[#94A3B8]">{rx.diagnosis} · {rx.date}</p>
                </div>
                <button
                  onClick={() => setEditTarget(rx)}
                  className="shrink-0 rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9]"
                >
                  Update
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-[#E2E8F0]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#64748B]">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Medicine</th>
                      <th className="px-4 py-2 font-semibold">Dosage</th>
                      <th className="px-4 py-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {rx.medicines.map((med, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 font-medium text-[#0F172A]">{med.name}</td>
                        <td className="px-4 py-2 text-[#334155]">{med.dosage}</td>
                        <td className="px-4 py-2 text-[#334155]">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rx.advice && (
                <p className="mt-3 text-xs leading-relaxed text-[#64748B]">
                  <span className="font-semibold text-[#334155]">Advice: </span>
                  {rx.advice}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {isCreating && (
        <Modal title="Create Prescription" onClose={() => setIsCreating(false)}>
          <PrescriptionForm onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
        </Modal>
      )}

      {editTarget && (
        <Modal title="Update Prescription" onClose={() => setEditTarget(null)}>
          <PrescriptionForm initial={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} />
        </Modal>
      )}
    </div>
  );
}