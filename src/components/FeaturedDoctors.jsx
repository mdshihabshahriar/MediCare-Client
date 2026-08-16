"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const specialtyBadgeStyles = {
  Cardiology: "bg-[#FEE2E2] text-[#991B1B]",
  Neurology: "bg-[#DBEAFE] text-[#1E3A8A]",
  Orthopedics: "bg-[#DCFCE7] text-[#166534]",
  Pediatrics: "bg-[#FEF3C7] text-[#92400E]",
  Dermatology: "bg-[#FCE7F3] text-[#9D174D]",
  Gynecology: "bg-[#E0F2FE] text-[#0369A1]",
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors?verifiedOnly=true`
      );

      if (!res.ok) {
        throw new Error("Failed to load doctors");
      }

      const data = await res.json();

      const featured = (Array.isArray(data) ? data : [])
        .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
        .slice(0, 4);

      setDoctors(featured);
    } catch (error) {
      console.error("Failed to load featured doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && doctors.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"
        >
          <div>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-bg-card px-4 py-1.5 text-xs font-bold tracking-widest text-primary sm:mx-0">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              FEATURED DOCTORS
            </div>
            <h2 className="mt-5 text-3xl font-extrabold text-heading sm:text-4xl">
              Meet Our Top-Rated Specialists
            </h2>
            <p className="mt-3 max-w-xl text-paragraph">
              Highly reviewed doctors trusted by thousands of patients on our
              platform.
            </p>
          </div>

          <Link
            href="/doctors"
            className="shrink-0 rounded-full border border-accent text-accent hover:bg-accent hover:text-white px-5 py-2.5 text-sm font-semibold text-heading transition-colors"
          >
            View All Doctors
          </Link>
        </motion.div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl bg-bg-card"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {doctors.map((doc) => (
              <motion.div key={doc.userId} variants={cardVariants}>
                <Link
                  href={`/doctors/${doc.userId}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-bg-card shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-bg-section">
                    <Image
                      src={doc.photoUrl}
                      alt={doc.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-heading shadow-sm backdrop-blur-sm">
                      <span className="text-warning">★</span>
                      {doc.rating > 0 ? doc.rating.toFixed(1) : "New"}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        specialtyBadgeStyles[doc.specialty] ||
                        "bg-bg-section text-muted"
                      }`}
                    >
                      {doc.specialty}
                    </span>

                    <h3 className="mt-3 text-base font-bold text-heading">
                      {doc.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                      {doc.qualifications}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                      <svg
                        className="h-3.5 w-3.5 shrink-0 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                      {doc.experience}+ years experience
                    </div>

                    <div className="mt-1.5 flex items-start gap-1.5 text-xs text-muted">
                      <svg
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 21h18" />
                        <path d="M5 21V7l8-4v18" />
                        <path d="M19 21V11l-6-4" />
                        <path d="M9 9v.01" />
                        <path d="M9 12v.01" />
                        <path d="M9 15v.01" />
                      </svg>
                      <span className="line-clamp-1">{doc.hospitalName}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted">Fee</p>
                        <p className="text-sm font-bold text-[#2563EB]">
                          ${doc.consultationFee}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-[#1D4ED8]">
                        Book Now
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDoctors;