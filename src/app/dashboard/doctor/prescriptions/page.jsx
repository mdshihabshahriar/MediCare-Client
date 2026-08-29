"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextField, Label, Input, TextArea, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

function Modal({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
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
      </motion.div>
    </motion.div>
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
        <AnimatePresence>
          {medicines.map((med, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-[1fr_1fr_auto] gap-2 rounded-xl border border-[#E2E8F0] p-3"
            >
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={() => setMedicines((prev) => [...prev, { name: "", dosage: "", duration: "" }])}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB]"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Add medicine
      </motion.button>
    </div>
  );
}

function PrescriptionForm({ initial, onSubmit, onCancel }) {
  const [medicines, setMedicines] = useState(
    initial?.medicines?.length ? initial.medicines : [{ name: "", dosage: "", duration: "" }]
  );

  return (
    <form onSubmit={(e) => onSubmit(e, medicines)} className="flex flex-col gap-5">
      <div>
        <Label className="text-sm font-medium text-[#334155]">Patient</Label>
        <div className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-semibold text-[#0F172A]">
          {initial?.patient}
        </div>
      </div>

      <TextField name="diagnosis" defaultValue={initial?.diagnosis} isRequired>
        <Label className="text-sm font-medium text-[#334155]">Diagnosis</Label>
        <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
      </TextField>

      <MedicineRows medicines={medicines} setMedicines={setMedicines} />

      <TextField name="advice" defaultValue={initial?.advice}>
        <Label className="text-sm font-medium text-[#334155]">Advice / Notes</Label>
        <TextArea
          rows={3}
          className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
        />
      </TextField>

      <div className="mt-1 flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">
          Cancel
        </button>
        <Button type="submit" className="flex-1 rounded-full bg-[#2563EB] py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]">
          Save Changes
        </Button>
      </div>
    </form>
  );
}

export default function PrescriptionManagement() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    document.title = "Prescription | MediCare";
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadPrescriptions = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/prescriptions/doctor/${session.user.id}`,
          { headers: { authorization: `Bearer ${tokenData?.token}` } }
        );
        const data = await res.json();
        setPrescriptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load prescriptions:", err);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();
  }, [session]);

  const handleUpdate = async (e, medicines) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updated = {
      diagnosis: formData.get("diagnosis"),
      advice: formData.get("advice"),
      medicines: medicines.filter((m) => m.name.trim() !== ""),
    };

    const { data: tokenData } = await authClient.token();

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${editTarget._id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        authorization: `Bearer ${tokenData?.token}`
      },
      body: JSON.stringify(updated),
    });
    toast.success("Prescription updated successfully");

    setPrescriptions((prev) =>
      prev.map((p) => (p._id === editTarget._id ? { ...p, ...updated } : p))
    );
    setEditTarget(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  if (isSessionPending || loading) {
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
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Prescription Management</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Update prescriptions you&apos;ve issued. New prescriptions are
          created from a completed appointment — see Appointment Requests.
        </p>
      </motion.div>

      <motion.div className="flex flex-col gap-4" variants={containerVariants}>
        {prescriptions.length === 0 ? (
          <motion.div variants={itemVariants} className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center text-sm text-[#94A3B8]">
            No prescriptions yet. Mark an appointment as completed to write your first one.
          </motion.div>
        ) : (
          prescriptions.map((rx) => (
            <motion.div key={rx._id} variants={itemVariants} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">{rx.patient}</p>
                  <p className="text-xs text-[#94A3B8]">
                    {rx.diagnosis} · {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("en-GB") : ""}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEditTarget(rx)}
                  className="shrink-0 rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9]"
                >
                  Update
                </motion.button>
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
                    {(rx.medicines || []).map((med, i) => (
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
            </motion.div>
          ))
        )}
      </motion.div>

      <AnimatePresence>
        {editTarget && (
          <Modal title="Update Prescription" onClose={() => setEditTarget(null)}>
            <PrescriptionForm initial={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}