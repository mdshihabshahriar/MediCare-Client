"use client";

import { useState } from "react";
import Image from "next/image";
import { TextField, Label, Input, Button } from "@heroui/react";

const initialAppointments = [
  {
    id: "1",
    doctor: "Dr. Amanda Ross",
    specialization: "Cardiology",
    photo: "https://i.pravatar.cc/150?img=44",
    date: "2026-07-28",
    time: "10:30 AM",
    status: "upcoming",
    fee: 1500,
  },
  {
    id: "2",
    doctor: "Dr. Michael Chen",
    specialization: "Neurology",
    photo: "https://i.pravatar.cc/150?img=12",
    date: "2026-08-02",
    time: "2:00 PM",
    status: "upcoming",
    fee: 1800,
  },
  {
    id: "3",
    doctor: "Dr. James Wilson",
    specialization: "Orthopedics",
    photo: "https://i.pravatar.cc/150?img=53",
    date: "2026-06-14",
    time: "9:00 AM",
    status: "completed",
    fee: 2000,
  },
  {
    id: "4",
    doctor: "Dr. Amara Rahman",
    specialization: "Pediatrics",
    photo: "https://i.pravatar.cc/150?img=32",
    date: "2026-05-30",
    time: "4:15 PM",
    status: "cancelled",
    fee: 1000,
  },
];

const statusStyles = {
  upcoming: "bg-[#DBEAFE] text-[#1D4ED8]",
  completed: "bg-[#DCFCE7] text-[#15803D]",
  cancelled: "bg-[#FEE2E2] text-[#DC2626]",
};

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

export default function MyAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [viewTarget, setViewTarget] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const handleReschedule = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDate = formData.get("date");
    const newTime = formData.get("time");

    // TODO: call your API to persist the reschedule, then update state.
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === rescheduleTarget.id ? { ...apt, date: newDate, time: newTime } : apt
      )
    );
    setRescheduleTarget(null);
  };

  const handleCancel = () => {
    // TODO: call your API to persist the cancellation.
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === cancelTarget.id ? { ...apt, status: "cancelled" } : apt))
    );
    setCancelTarget(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">My Appointments</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          View, reschedule, or cancel your booked appointments.
        </p>
      </div>

      {/* Table (desktop) */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Doctor</th>
              <th className="px-6 py-3.5 font-semibold">Date &amp; Time</th>
              <th className="px-6 py-3.5 font-semibold">Fee</th>
              <th className="px-6 py-3.5 font-semibold">Status</th>
              <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                      <Image src={apt.photo} alt={apt.doctor} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">{apt.doctor}</p>
                      <p className="text-xs text-[#94A3B8]">{apt.specialization}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#334155]">
                  {apt.date} <span className="text-[#94A3B8]">· {apt.time}</span>
                </td>
                <td className="px-6 py-4 font-semibold text-[#0F172A]">৳{apt.fee}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[apt.status]}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setViewTarget(apt)}
                      className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9]"
                    >
                      View
                    </button>
                    {apt.status === "upcoming" && (
                      <>
                        <button
                          onClick={() => setRescheduleTarget(apt)}
                          className="rounded-lg border border-[#2563EB] px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-[#EFF6FF]"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => setCancelTarget(apt)}
                          className="rounded-lg border border-[#EF4444] px-3 py-1.5 text-xs font-semibold text-[#EF4444] hover:bg-[#FEF2F2]"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="flex flex-col gap-4 md:hidden">
        {appointments.map((apt) => (
          <div key={apt.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image src={apt.photo} alt={apt.doctor} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#0F172A]">{apt.doctor}</p>
                <p className="text-xs text-[#94A3B8]">{apt.specialization}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[apt.status]}`}>
                {apt.status}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <p className="text-[#334155]">{apt.date} · {apt.time}</p>
              <p className="font-semibold text-[#0F172A]">৳{apt.fee}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setViewTarget(apt)}
                className="flex-1 rounded-lg border border-[#E2E8F0] py-1.5 text-xs font-semibold text-[#334155]"
              >
                View
              </button>
              {apt.status === "upcoming" && (
                <>
                  <button
                    onClick={() => setRescheduleTarget(apt)}
                    className="flex-1 rounded-lg border border-[#2563EB] py-1.5 text-xs font-semibold text-[#2563EB]"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setCancelTarget(apt)}
                    className="flex-1 rounded-lg border border-[#EF4444] py-1.5 text-xs font-semibold text-[#EF4444]"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View modal */}
      {viewTarget && (
        <Modal title="Appointment Details" onClose={() => setViewTarget(null)}>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Image src={viewTarget.photo} alt={viewTarget.doctor} fill className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-[#0F172A]">{viewTarget.doctor}</p>
              <p className="text-xs text-[#94A3B8]">{viewTarget.specialization}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3">
              <span className="text-[#64748B]">Date &amp; Time</span>
              <span className="font-semibold text-[#0F172A]">{viewTarget.date} · {viewTarget.time}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3">
              <span className="text-[#64748B]">Consultation Fee</span>
              <span className="font-semibold text-[#0F172A]">৳{viewTarget.fee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Status</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[viewTarget.status]}`}>
                {viewTarget.status}
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* Reschedule modal */}
      {rescheduleTarget && (
        <Modal title="Reschedule Appointment" onClose={() => setRescheduleTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Rescheduling with <span className="font-semibold text-[#0F172A]">{rescheduleTarget.doctor}</span>
          </p>
          <form onSubmit={handleReschedule} className="mt-4 flex flex-col gap-4">
            <TextField name="date" type="date" defaultValue={rescheduleTarget.date} isRequired>
              <Label className="text-sm font-medium text-[#334155]">New Date</Label>
              <Input className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
            </TextField>
            <TextField name="time" defaultValue={rescheduleTarget.time} isRequired>
              <Label className="text-sm font-medium text-[#334155]">New Time</Label>
              <Input
                placeholder="e.g. 11:00 AM"
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </TextField>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]"
              >
                Cancel
              </button>
              <Button type="submit" className="flex-1 rounded-full bg-[#2563EB] py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]">
                Confirm
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Cancel confirm modal */}
      {cancelTarget && (
        <Modal title="Cancel Appointment" onClose={() => setCancelTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Are you sure you want to cancel your appointment with{" "}
            <span className="font-semibold text-[#0F172A]">{cancelTarget.doctor}</span> on{" "}
            <span className="font-semibold text-[#0F172A]">{cancelTarget.date}</span>? This can&apos;t be undone.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setCancelTarget(null)}
              className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]"
            >
              Keep Appointment
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-full bg-[#EF4444] py-2.5 text-sm font-bold text-white hover:bg-[#DC2626]"
            >
              Yes, Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}