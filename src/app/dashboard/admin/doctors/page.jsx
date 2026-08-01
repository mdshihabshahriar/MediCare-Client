"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
      <p className="text-xs leading-relaxed text-[#334155]">
        <span className="font-semibold text-[#0F172A]">{label}: </span>
        {value}
      </p>
    </div>
  );
}

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState(null); 
  const [filter, setFilter] = useState("all");
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null); 

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`);
        const data = await res.json();

        const safeData = Array.isArray(data) ? data.filter(Boolean) : [];
        setDoctors(safeData);
      } catch (err) {
        console.error("Failed to load doctors:", err);
        setDoctors([]);
      }
    };
    loadDoctors();
  }, []);

  const filtered =
    doctors === null
      ? []
      : filter === "all"
      ? doctors
      : doctors.filter((d) => d.verificationStatus === filter);

  const updateVerification = async (userId, status) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${userId}/verification`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setDoctors((prev) =>
      prev.map((d) => (d.userId === userId ? { ...d, verificationStatus: status } : d))
    );
  };

  const handleVerify = async () => {
    await updateVerification(verifyTarget.userId, "verified");
    setVerifyTarget(null);
  };

  const handleReject = async () => {
    await updateVerification(rejectTarget.userId, "rejected");
    setRejectTarget(null);
  };

  const handleUnverify = async () => {
    await updateVerification(statusTarget.userId, "pending");
    setStatusTarget(null);
  };

  if (doctors === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2563EB]" />
      </div>
    );
  }

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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {filtered.map((doc) => (
          <div key={doc.userId} className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="flex gap-4 p-5 sm:p-6">
              {/* Photo */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F1F5F9] sm:h-24 sm:w-24">
                <Image
                  src={doc.photoUrl || "https://i.pravatar.cc/150?u=" + doc.userId}
                  alt={doc.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-[#0F172A]">{doc.name}</p>
                    <p className="mt-0.5 text-sm font-medium text-[#2563EB]">{doc.specialty}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${verificationStyles[doc.verificationStatus]}`}>
                    {doc.verificationStatus}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-[#94A3B8]">{doc.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-[#E2E8F0] px-5 py-4 sm:px-6">
              <InfoRow
                label="Hospital"
                value={doc.hospitalName}
                icon={
                  <>
                    <path d="M3 21h18" />
                    <path d="M5 21V7l8-4v18" />
                    <path d="M19 21V11l-6-4" />
                    <path d="M9 9v.01" />
                    <path d="M9 12v.01" />
                    <path d="M9 15v.01" />
                  </>
                }
              />
              <InfoRow
                label="Qualifications"
                value={doc.qualifications}
                icon={
                  <>
                    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </>
                }
              />
              <InfoRow
                label="Clinical Experience"
                value={`${doc.experience} Years`}
                icon={
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </>
                }
              />
              <InfoRow
                label="Consultation Charge"
                value={`$${doc.consultationFee}`}
                icon={
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v10" />
                    <path d="M15 9.5c0-1.4-1.34-2.5-3-2.5s-3 1.1-3 2.5 1.34 2.5 3 2.5 3 1.1 3 2.5-1.34 2.5-3 2.5-3-1.1-3-2.5" />
                  </>
                }
              />
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-wrap gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6">
              {doc.verificationStatus === "pending" && (
                <>
                  <button
                    onClick={() => setVerifyTarget(doc)}
                    className="flex-1 rounded-lg bg-[#10B981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#059669]"
                  >
                    Verify Doctor
                  </button>
                  <button
                    onClick={() => setRejectTarget(doc)}
                    className="flex-1 rounded-lg border border-[#EF4444] px-4 py-2 text-xs font-semibold text-[#EF4444] hover:bg-[#FEF2F2]"
                  >
                    Reject License
                  </button>
                </>
              )}
              {doc.verificationStatus === "verified" && (
                <button
                  onClick={() => setStatusTarget(doc)}
                  className="flex-1 rounded-lg border border-[#F59E0B] px-4 py-2 text-xs font-semibold text-[#B45309] hover:bg-[#FFFBEB]"
                >
                  Cancel Verify
                </button>
              )}
              {doc.verificationStatus === "rejected" && (
                <button
                  onClick={() => setVerifyTarget(doc)}
                  className="flex-1 rounded-lg border border-[#10B981] px-4 py-2 text-xs font-semibold text-[#10B981] hover:bg-[#F0FDF4]"
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
        <Modal title="Reject License" onClose={() => setRejectTarget(null)}>
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
        <Modal title="Cancel Verify" onClose={() => setStatusTarget(null)}>
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