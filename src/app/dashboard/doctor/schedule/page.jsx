"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextField, Label, Input, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];


function Modal({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-base-content">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-base-content/50 hover:bg-base-200 hover:text-base-content"
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

function ScheduleForm({ initial, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <Label className="text-sm font-medium text-base-content/80">Day</Label>
        <select
          name="day"
          required
          defaultValue={initial?.day || ""}
          className="mt-1.5 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="" disabled>
            Select a day
          </option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField name="startTime" type="time" defaultValue={initial?.startTime} isRequired>
          <Label className="text-sm font-medium text-base-content/80">Start Time</Label>
          <Input className="mt-1.5 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </TextField>
        <TextField name="endTime" type="time" defaultValue={initial?.endTime} isRequired>
          <Label className="text-sm font-medium text-base-content/80">End Time</Label>
          <Input className="mt-1.5 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </TextField>
      </div>

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border border-base-300 py-2.5 text-sm font-semibold text-base-content/80"
        >
          Cancel
        </button>
        <Button type="submit" className="flex-1 rounded-full bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary/90">
          {initial ? "Save Changes" : "Add Slot"}
        </Button>
      </div>
    </form>
  );
}

export default function ManageSchedule() {
  const [slots, setSlots] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    document.title = "Manage Schedule | MediCare";
  }, []);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    const { data: tokenData } = await authClient.token();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedules/${session.user.id}`,
      { headers: { authorization: `Bearer ${tokenData?.token}` } }
    );

    const data = await res.json();
    setSlots(data);
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { data: tokenData } = await authClient.token();
    const newSlot = {
      id: crypto.randomUUID(),
      day: formData.get("day"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
    };
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${tokenData?.token}`
      },
      body: JSON.stringify({
        doctorId: session.user.id,
        day: formData.get("day"),
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime"),
      }),
    });

    await loadSchedules();
    setIsAdding(false);
    setIsAdding(false);
    toast.success("Schedule slot added successfully");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      day: formData.get("day"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
    };

    const { data: tokenData } = await authClient.token();

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedules/${editTarget._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify(updated),
      }
    );

    await loadSchedules();
    setEditTarget(null);
    toast.success("Schedule slot updated successfully");
  };

  const handleDelete = async () => {
    const { data: tokenData } = await authClient.token();
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedules/${deleteTarget._id}`,
      {
        method: "DELETE",
        headers: { authorization: `Bearer ${tokenData?.token}` },
      }
    );

    await loadSchedules();
    setDeleteTarget(null);
    toast.success("Schedule slot removed successfully");
  };

  const grouped = days
    .map((day) => ({ day, slots: slots.filter((s) => s.day === day) }))
    .filter((group) => group.slots.length > 0);

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

  const slotVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-base-content sm:text-3xl">Manage Schedule</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Set the days and times you&apos;re available for appointments.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsAdding(true)}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Add Schedule
        </motion.button>
      </motion.div>

      {grouped.length === 0 ? (
        <motion.div variants={itemVariants} className="rounded-2xl border border-dashed border-[#CBD5E1] bg-base-100 p-10 text-center text-sm text-base-content/50">
          No available slots yet. Add your first schedule slot.
        </motion.div>
      ) : (
        <motion.div className="flex flex-col gap-4" variants={containerVariants}>
          <AnimatePresence>
            {grouped.map((group) => (
              <motion.div
                key={group.day}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <p className="text-sm font-bold text-base-content">{group.day}</p>
                <motion.div
                  className="mt-3 flex flex-col divide-y divide-base-300"
                  initial="hidden"
                  animate="show"
                  variants={containerVariants}
                >
                  <AnimatePresence>
                    {group.slots.map((slot) => (
                      <motion.div
                        key={slot._id}
                        variants={slotVariants}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      >
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-primary">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 3" />
                          </svg>
                          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditTarget(slot)}
                            className="rounded-lg border border-base-300 px-3 py-1.5 text-xs font-semibold text-base-content/80 hover:bg-base-200"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => setDeleteTarget(slot)}
                            className="rounded-lg border border-[#EF4444] px-3 py-1.5 text-xs font-semibold text-[#EF4444] hover:bg-[#FEF2F2]"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {isAdding && (
          <Modal title="Add Schedule Slot" onClose={() => setIsAdding(false)}>
            <ScheduleForm onSubmit={handleAdd} onCancel={() => setIsAdding(false)} />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editTarget && (
          <Modal title="Update Schedule Slot" onClose={() => setEditTarget(null)}>
            <ScheduleForm initial={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <Modal title="Remove Schedule Slot" onClose={() => setDeleteTarget(null)}>
            <p className="text-sm text-base-content/60">
              Remove <span className="font-semibold text-base-content">{deleteTarget.day}, {deleteTarget.startTime}–{deleteTarget.endTime}</span> from your availability?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-full border border-base-300 py-2.5 text-sm font-semibold text-base-content/80"
              >
                Keep Slot
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-full bg-[#EF4444] py-2.5 text-sm font-bold text-white hover:bg-[#DC2626]"
              >
                Yes, Remove
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}