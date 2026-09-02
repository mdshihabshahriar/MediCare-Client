"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

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

export default function MyPrescriptions() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "My Prescriptions | MediCare";
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadPrescriptions = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/prescriptions/patient/${session.user.id}`,
          { headers: { authorization: `Bearer ${tokenData?.token}` } }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        const sorted = (Array.isArray(data) ? data : []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPrescriptions(sorted);
      } catch (err) {
        console.error("Failed to load prescriptions:", err);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();
  }, [session]);

  const filtered = prescriptions.filter((rx) => {
    const term = search.toLowerCase();
    return (
      rx.diagnosis?.toLowerCase().includes(term) ||
      rx.doctorName?.toLowerCase().includes(term) ||
      (rx.medicines || []).some((m) => m.name?.toLowerCase().includes(term))
    );
  });

  if (isSessionPending || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-base-300 border-t-primary"
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
        <h1 className="text-2xl font-extrabold text-base-content sm:text-3xl">
          My Prescriptions
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Every prescription your doctors have issued, in one place.
        </p>
      </motion.div>

      {prescriptions.length > 0 && (
        <motion.div variants={itemVariants} className="relative">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by diagnosis, doctor, or medicine..."
            className="w-full max-w-md rounded-xl border border-base-300 bg-base-100 py-2.5 pl-10 pr-4 text-sm text-base-content outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </motion.div>
      )}

      <motion.div className="flex flex-col gap-4" variants={containerVariants}>
        {prescriptions.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-16 text-center"
          >
            <h2 className="text-lg font-semibold text-base-content">
              No Prescriptions Yet
            </h2>
            <p className="mt-2 text-sm text-base-content/50">
              Prescriptions your doctor issues after a completed visit will show up here.
            </p>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-10 text-center text-sm text-base-content/50"
          >
            No prescriptions match your search.
          </motion.div>
        ) : (
          filtered.map((rx) => (
            <motion.div
              key={rx._id}
              variants={itemVariants}
              className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-base-200">
                    <Image
                      src={rx.doctorPhoto || "https://i.pravatar.cc/150?u=" + rx.doctorId}
                      alt={rx.doctorName || "Doctor"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-base-content">
                       {rx.doctorName || "Unknown"}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("en-GB") : ""}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
                    <path d="M9 9h6" />
                    <path d="M9 13h6" />
                    <path d="M9 17h3" />
                  </svg>
                  {rx.diagnosis}
                </span>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-base-300">
                <table className="w-full text-left text-xs">
                  <thead className="bg-base-200 text-base-content/60">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Medicine</th>
                      <th className="px-4 py-2 font-semibold">Dosage</th>
                      <th className="px-4 py-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300">
                    {(rx.medicines || []).map((med, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 font-medium text-base-content">{med.name}</td>
                        <td className="px-4 py-2 text-base-content/80">{med.dosage}</td>
                        <td className="px-4 py-2 text-base-content/80">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rx.advice && (
                <p className="mt-3 text-xs leading-relaxed text-base-content/60">
                  <span className="font-semibold text-base-content/80">Advice: </span>
                  {rx.advice}
                </p>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}