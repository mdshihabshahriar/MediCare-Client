"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const initialRequests = [
  {
    id: "1",
    patient: "Rafiq Ahmed",
    photo: "https://i.pravatar.cc/150?img=12",
    reason: "Follow-up consultation",
    date: "2026-07-28",
    time: "10:00 AM",
    status: "pending",
  },
  {
    id: "2",
    patient: "Fatima Noor",
    photo: "https://i.pravatar.cc/150?img=32",
    reason: "Chest pain evaluation",
    date: "2026-07-28",
    time: "11:30 AM",
    status: "accepted",
  },
  {
    id: "3",
    patient: "David Okafor",
    photo: "https://i.pravatar.cc/150?img=15",
    reason: "Routine checkup",
    date: "2026-07-25",
    time: "9:00 AM",
    status: "accepted",
  },
  {
    id: "4",
    patient: "Mitu Rahman",
    photo: "https://i.pravatar.cc/150?img=25",
    reason: "Skin rash",
    date: "2026-07-20",
    time: "3:00 PM",
    status: "rejected",
  },
];

const statusStyles = {
  pending: "bg-[#FEF3C7] text-[#B45309]",
  accepted: "bg-[#DBEAFE] text-[#1D4ED8]",
  completed: "bg-[#DCFCE7] text-[#15803D]",
  rejected: "bg-[#FEE2E2] text-[#DC2626]",
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

export default function AppointmentRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleAccept = (id) => {
    // TODO: PATCH status to "accepted" on your API.
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)));
  };

  const handleReject = () => {
    // TODO: PATCH status to "rejected" on your API.
    setRequests((prev) =>
      prev.map((r) => (r.id === rejectTarget.id ? { ...r, status: "rejected" } : r))
    );
    setRejectTarget(null);
  };

  const handleMarkCompleted = () => {
    // TODO: PATCH status to "completed" on your API.
    setRequests((prev) =>
      prev.map((r) => (r.id === completeTarget.id ? { ...r, status: "completed" } : r))
    );
    const appointmentId = completeTarget.id;
    setCompleteTarget(null);
    // Navigate straight to prescription creation for this appointment.
    router.push(`/dashboard/doctor/prescriptions/new?appointmentId=${appointmentId}`);
  };

  const filters = ["all", "pending", "accepted", "completed", "rejected"];
  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Appointment Requests</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Accept or reject incoming requests, and mark visits as completed.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === f
                ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center text-sm text-[#94A3B8]">
            No {filter !== "all" ? filter : ""} requests.
          </div>
        ) : (
          filtered.map((req) => (
            <div key={req.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Image src={req.photo} alt={req.patient} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{req.patient}</p>
                    <p className="text-xs text-[#94A3B8]">{req.reason}</p>
                    <p className="mt-0.5 text-xs text-[#64748B]">{req.date} · {req.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[req.status]}`}>
                    {req.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-[#E2E8F0] pt-4">
                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setRejectTarget(req)}
                      className="rounded-lg border border-[#EF4444] px-4 py-2 text-xs font-semibold text-[#EF4444] hover:bg-[#FEF2F2]"
                    >
                      Reject
                    </button>
                  </>
                )}
                {req.status === "accepted" && (
                  <button
                    onClick={() => setCompleteTarget(req)}
                    className="rounded-lg bg-[#10B981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#059669]"
                  >
                    Mark Completed
                  </button>
                )}
                {req.status === "completed" && (
                  <span className="text-xs font-medium text-[#94A3B8]">
                    Visit completed — prescription created.
                  </span>
                )}
                {req.status === "rejected" && (
                  <span className="text-xs font-medium text-[#94A3B8]">This request was rejected.</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {rejectTarget && (
        <Modal title="Reject Appointment" onClose={() => setRejectTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Reject the appointment request from{" "}
            <span className="font-semibold text-[#0F172A]">{rejectTarget.patient}</span>?
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setRejectTarget(null)}
              className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]"
            >
              Keep Pending
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="flex-1 rounded-full bg-[#EF4444] py-2.5 text-sm font-bold text-white hover:bg-[#DC2626]"
            >
              Yes, Reject
            </button>
          </div>
        </Modal>
      )}

      {completeTarget && (
        <Modal title="Mark as Completed" onClose={() => setCompleteTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Mark the visit with{" "}
            <span className="font-semibold text-[#0F172A]">{completeTarget.patient}</span> as
            completed? You&apos;ll be taken to create their prescription next.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setCompleteTarget(null)}
              className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleMarkCompleted}
              className="flex-1 rounded-full bg-[#10B981] py-2.5 text-sm font-bold text-white hover:bg-[#059669]"
            >
              Complete &amp; Continue
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}