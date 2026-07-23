"use client";

import { useState } from "react";
import { TextField, Label, Input, Button } from "@heroui/react";

const initialSlots = [
  { id: "1", day: "Sunday", startTime: "09:00", endTime: "13:00" },
  { id: "2", day: "Monday", startTime: "09:00", endTime: "13:00" },
  { id: "3", day: "Monday", startTime: "17:00", endTime: "20:00" },
  { id: "4", day: "Wednesday", startTime: "10:00", endTime: "14:00" },
];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
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

function ScheduleForm({ initial, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <Label className="text-sm font-medium text-[#334155]">Day</Label>
        <select
          name="day"
          required
          defaultValue={initial?.day || ""}
          className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
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
          <Label className="text-sm font-medium text-[#334155]">Start Time</Label>
          <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
        </TextField>
        <TextField name="endTime" type="time" defaultValue={initial?.endTime} isRequired>
          <Label className="text-sm font-medium text-[#334155]">End Time</Label>
          <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
        </TextField>
      </div>

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]"
        >
          Cancel
        </button>
        <Button type="submit" className="flex-1 rounded-full bg-[#2563EB] py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]">
          {initial ? "Save Changes" : "Add Slot"}
        </Button>
      </div>
    </form>
  );
}

export default function ManageSchedule() {
  const [slots, setSlots] = useState(initialSlots);
  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSlot = {
      id: crypto.randomUUID(),
      day: formData.get("day"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
    };
    // TODO: POST `newSlot` to your API.
    setSlots((prev) => [...prev, newSlot]);
    setIsAdding(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      day: formData.get("day"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
    };
    // TODO: PATCH the slot on your API.
    setSlots((prev) => prev.map((s) => (s.id === editTarget.id ? { ...s, ...updated } : s)));
    setEditTarget(null);
  };

  const handleDelete = () => {
    // TODO: DELETE the slot on your API.
    setSlots((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // Group slots by day for a cleaner weekly view
  const grouped = days
    .map((day) => ({ day, slots: slots.filter((s) => s.day === day) }))
    .filter((group) => group.slots.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Manage Schedule</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Set the days and times you&apos;re available for appointments.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Add Schedule
        </button>
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center text-sm text-[#94A3B8]">
          No available slots yet. Add your first schedule slot.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map((group) => (
            <div key={group.day} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-[#0F172A]">{group.day}</p>
              <div className="mt-3 flex flex-col divide-y divide-[#E2E8F0]">
                {group.slots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB]">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditTarget(slot)}
                        className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9]"
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
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdding && (
        <Modal title="Add Schedule Slot" onClose={() => setIsAdding(false)}>
          <ScheduleForm onSubmit={handleAdd} onCancel={() => setIsAdding(false)} />
        </Modal>
      )}

      {editTarget && (
        <Modal title="Update Schedule Slot" onClose={() => setEditTarget(null)}>
          <ScheduleForm initial={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Remove Schedule Slot" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Remove <span className="font-semibold text-[#0F172A]">{deleteTarget.day}, {deleteTarget.startTime}–{deleteTarget.endTime}</span> from your availability?
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]"
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
    </div>
  );
}