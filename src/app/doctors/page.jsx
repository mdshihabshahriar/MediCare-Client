"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const specialtyOptions = [
  "All Specializations",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Gynecology",
];

const specialtyBadgeStyles = {
  Cardiology: "bg-[#FEE2E2] text-[#991B1B]",
  Neurology: "bg-[#DBEAFE] text-[#1E3A8A]",
  Orthopedics: "bg-[#DCFCE7] text-[#166534]",
  Pediatrics: "bg-[#FEF3C7] text-[#92400E]",
  Dermatology: "bg-[#FCE7F3] text-[#9D174D]",
  Gynecology: "bg-[#E0F2FE] text-[#0369A1]",
};

const sortOptions = [
  { value: "feeLow", label: "Sort: Clinic Fee (Low to High)" },
  { value: "feeHigh", label: "Sort: Clinic Fee (High to Low)" },
  { value: "experience", label: "Experience (High to Low)" },
  { value: "quality", label: "Sort: Quality (Top Rated)" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const FindDoctorsPage = () => {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specializations");
  const [sortBy, setSortBy] = useState("feeLow");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
  const loadDoctors = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/doctors?verifiedOnly=true`
    );

    const data = await res.json();
    setDoctors(data);
  };

  loadDoctors();
}, []);

  const filteredDoctors = useMemo(() => {
    let result = doctors.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialty =
        specialty === "All Specializations" || doc.specialty === specialty;
      return matchesSearch && matchesSpecialty;
    });

  result = [...result].sort((a, b) => {
    if (sortBy === "feeLow") {
      return Number(a.consultationFee) - Number(b.consultationFee);
    }

    if (sortBy === "feeHigh") {
      return Number(b.consultationFee) - Number(a.consultationFee);
    }

    if (sortBy === "experience") {
      return Number(b.experience) - Number(a.experience);
    }

    return Number(b.rating || 0) - Number(a.rating || 0);
  });

    return result;
  }, [doctors,search, specialty, sortBy]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold text-[#0F172A] sm:text-4xl">Find Doctors</h1>
          <p className="mt-2 text-sm text-[#64748B] sm:text-base">
            Search and filter through our verified specialists to find the right doctor for you.
          </p>
        </div>

        <div className="sticky top-16 z-30 mt-8 rounded-2xl border border-[#E2E8F0] bg-white/90 p-4 shadow-sm backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
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
                placeholder="Search doctor name..."
                className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div className="relative lg:w-64">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-4 pr-9 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              >
                {specialtyOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <div className="relative lg:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-4 pr-9 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-[#64748B]">
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} found
        </p>
        {filteredDoctors.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-14 text-center">
            <p className="text-sm font-semibold text-[#0F172A]">No doctors found</p>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredDoctors.map((doc) => (
                <motion.div
                  key={doc.userId}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Link
                    href={`/doctors/${doc.userId}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F1F5F9]">
                      <Image
                        src={doc.photoUrl}
                        alt={doc.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-[#0F172A] shadow-sm backdrop-blur-sm">
                        <span className="text-[#F59E0B]">★</span>
                        {doc.rating > 0 ? doc.rating.toFixed(1) : "New"}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${specialtyBadgeStyles[doc.specialty]}`}
                      >
                        {doc.specialty}
                      </span>

                      <h3 className="mt-3 text-lg font-bold text-[#0F172A]">{doc.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#94A3B8]">
                        {doc.qualifications}
                      </p>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#64748B]">
                        <svg className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 3" />
                        </svg>
                        {doc.experience}+ years experience
                      </div>

                      <div className="mt-1.5 flex items-start gap-1.5 text-xs text-[#64748B]">
                        <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21h18" />
                          <path d="M5 21V7l8-4v18" />
                          <path d="M19 21V11l-6-4" />
                          <path d="M9 9v.01" />
                          <path d="M9 12v.01" />
                          <path d="M9 15v.01" />
                        </svg>
                        <span className="line-clamp-1">{doc.hospitalName}</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-4">
                        <div>
                          <p className="text-xs text-[#94A3B8]">Consultation Fee</p>
                          <p className="text-base font-bold text-[#2563EB]">${doc.consultationFee
                          }</p>
                        </div>
                        <span className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-[#1D4ED8]">
                          Book Now
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
}
export default FindDoctorsPage;