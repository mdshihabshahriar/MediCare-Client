"use client";

import { useState } from "react";
import Image from "next/image";

const initialDoctors = [
  { id: "1", name: "Dr. Amanda Ross", email: "amanda.ross@example.com", specialization: "Cardiology", photo: "https://i.pravatar.cc/150?img=44", verification: "verified" },
  { id: "2", name: "Dr. Michael Chen", email: "michael.chen@example.com", specialization: "Neurology", photo: "https://i.pravatar.cc/150?img=12", verification: "verified" },
  { id: "3", name: "Dr. Nusrat Jahan", email: "nusrat.jahan@example.com", specialization: "Dermatology", photo: "https://i.pravatar.cc/150?img=28", verification: "pending" },
  { id: "4", name: "Dr. Omar Siddique", email: "omar.siddique@example.com", specialization: "Orthopedics", photo: "https://i.pravatar.cc/150?img=59", verification: "pending" },
  { id: "5", name: "Dr. Tanvir Hasan", email: "tanvir.hasan@example.com", specialization: "ENT", photo: "https://i.pravatar.cc/150?img=13", verification: "rejected" },
];

const verificationStyles = {
  verified: "bg-[#DCFCE7] text-[#15803D]",
  pending: "bg-[#FEF3C7] text-[#B45309]",
  rejected: "bg-[#FEE2E2] text-[#DC2626]",
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A]" aria-label="Close">
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

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [filter, setFilter] = useState("all");
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null); // for cancelling an already-verified doctor

  const filtered = filter === "all" ? doctors : doctors.filter((d) => d.verification === filter);

  const handleVerify = () => {
    // TODO: PATCH verification status to "verified" on your API.
    setDoctors((prev) => prev.map((d) => (d.id === verifyTarget.id ? { ...d, verification: "verified" } : d)));
    setVerifyTarget(null);
  };

  const handleReject = () => {
    // TODO: PATCH verification status to "rejected" on your API.
    setDoctors((prev) => prev.map((d) => (d.id === rejectTarget.id ? { ...d, verification: "rejected" } : d)));
    setRejectTarget(null);
  };

  const handleUnverify = () => {
    // TODO: PATCH verification status back to "pending" on your API
    // (i.e. admin revoking a previously verified doctor's status).
    setDoctors((prev) => prev.map((d) => (d.id === statusTarget.id ? { ...d, verification: "pending" } : d)));
    setStatusTarget(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Manage Doctors</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Review and verify doctors before they can accept patients.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "verified", "rejected"].map((f) => (
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
        {filtered.map((doc) => (
          <div key={doc.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Image src={doc.photo} alt={doc.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">{doc.name}</p>
                  <p className="text-xs text-[#94A3B8]">{doc.specialization} · {doc.email}</p>
                </div>
              </div>
              <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${verificationStyles[doc.verification]}`}>
                {doc.verification}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#E2E8F0] pt-4">
              {doc.verification === "pending" && (
                <>
                  <button
                    onClick={() => setVerifyTarget(doc)}
                    className="rounded-lg bg-[#10B981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#059669]"
                  >
                    Verify Doctor
                  </button>
                  <button
                    onClick={() => setRejectTarget(doc)}
                    className="rounded-lg border border-[#EF4444] px-4 py-2 text-xs font-semibold text-[#EF4444] hover:bg-[#FEF2F2]"
                  >
                    Reject
                  </button>
                </>
              )}
              {doc.verification === "verified" && (
                <button
                  onClick={() => setStatusTarget(doc)}
                  className="rounded-lg border border-[#F59E0B] px-4 py-2 text-xs font-semibold text-[#B45309] hover:bg-[#FFFBEB]"
                >
                  Cancel Verification
                </button>
              )}
              {doc.verification === "rejected" && (
                <button
                  onClick={() => setVerifyTarget(doc)}
                  className="rounded-lg border border-[#10B981] px-4 py-2 text-xs font-semibold text-[#10B981] hover:bg-[#F0FDF4]"
                >
                  Re-verify
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {verifyTarget && (
        <Modal title="Verify Doctor" onClose={() => setVerifyTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Verify <span className="font-semibold text-[#0F172A]">{verifyTarget.name}</span>? They&apos;ll
            immediately become visible to patients and able to accept appointments.
          </p>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setVerifyTarget(null)} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">Cancel</button>
            <button type="button" onClick={handleVerify} className="flex-1 rounded-full bg-[#10B981] py-2.5 text-sm font-bold text-white hover:bg-[#059669]">Yes, Verify</button>
          </div>
        </Modal>
      )}

      {rejectTarget && (
        <Modal title="Reject Doctor Verification" onClose={() => setRejectTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Reject the verification request from <span className="font-semibold text-[#0F172A]">{rejectTarget.name}</span>?
          </p>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setRejectTarget(null)} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">Cancel</button>
            <button type="button" onClick={handleReject} className="flex-1 rounded-full bg-[#EF4444] py-2.5 text-sm font-bold text-white hover:bg-[#DC2626]">Yes, Reject</button>
          </div>
        </Modal>
      )}

      {statusTarget && (
        <Modal title="Cancel Verification" onClose={() => setStatusTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Revoke <span className="font-semibold text-[#0F172A]">{statusTarget.name}</span>&apos;s verified
            status? They&apos;ll be hidden from patients until re-verified.
          </p>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setStatusTarget(null)} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">Keep Verified</button>
            <button type="button" onClick={handleUnverify} className="flex-1 rounded-full bg-[#F59E0B] py-2.5 text-sm font-bold text-white hover:bg-[#D97706]">Yes, Revoke</button>
          </div>
        </Modal>
      )}
    </div>
  );
}