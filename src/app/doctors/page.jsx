"use client";

import { useEffect, useState, useCallback } from "react";
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
  "Ophthalmology",
  "Medicine",
  "ENT"
];

const specialtyBadgeStyles = {
  Cardiology: "bg-[#FEE2E2] text-[#991B1B]",
  Neurology: "bg-[#DBEAFE] text-[#1E3A8A]",
  Orthopedics: "bg-[#DCFCE7] text-[#166534]",
  Pediatrics: "bg-[#FEF3C7] text-[#92400E]",
  Dermatology: "bg-[#FCE7F3] text-[#9D174D]",
  Gynecology: "bg-[#E0F2FE] text-[#0369A1]",
  Ophthalmology: "bg-[#FEEBC8] text-[#C2410C]",
  Medicine: "bg-[#EDE9FE] text-[#5B21B6]",
  ENT: "bg-[#DCFCE7] text-[#166534]",
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

const LIMIT = 9;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        pages.push("...");
      }
    }

    return pages.filter(
      (item, index, arr) => !(item === "..." && arr[index - 1] === "...")
    );
  };

  useEffect(() => {
    document.title = "Find Doctors | MediCare";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-10 flex items-center justify-center gap-2"
    >

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition-colors hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-sm text-[#94A3B8]"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
              page === currentPage
                ? "border-[#2563EB] bg-[#2563EB] text-white"
                : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition-colors hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </motion.div>
  );
};


const FindDoctorsPage = () => {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specializations");
  const [sortBy, setSortBy] = useState("feeLow");
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, specialty, sortBy]);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        verifiedOnly: "true",
        page: currentPage,
        limit: LIMIT,
      });

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (specialty !== "All Specializations") params.set("specialty", specialty);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors?${params.toString()}`
      );
      const data = await res.json();
      console.log("👉 API data:", data);

      setDoctors(data.doctors);
      setTotalPages(data.total_pages);
      setTotalData(data.total_data);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, specialty, sortBy]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold text-[#0F172A] sm:text-4xl">
            Find Doctors
          </h1>
          <p className="mt-2 text-sm text-[#64748B] sm:text-base">
            Search and filter through our verified specialists to find the right
            doctor for you.
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
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-[#64748B]">
          {totalData} doctor{totalData !== 1 ? "s" : ""} found
        </p>

        {loading && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-[#E2E8F0] bg-white"
              />
            ))}
          </div>
        )}

        {!loading && doctors.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-14 text-center">
            <p className="text-sm font-semibold text-[#0F172A]">
              No doctors found
            </p>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
          </div>
        )}

        {!loading && doctors.length > 0 && (
          <motion.div
            layout
            className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {doctors.map((doc) => (
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
                      <h3 className="mt-3 text-lg font-bold text-[#0F172A]">
                        {doc.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#94A3B8]">
                        {doc.qualifications}
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#64748B]">
                        <svg
                          className="h-3.5 w-3.5 shrink-0 text-[#2563EB]"
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
                      <div className="mt-1.5 flex items-start gap-1.5 text-xs text-[#64748B]">
                        <svg
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2563EB]"
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
                      <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-4">
                        <div>
                          <p className="text-xs text-[#94A3B8]">
                            Consultation Fee
                          </p>
                          <p className="text-base font-bold text-[#2563EB]">
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
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </main>
  );
};

export default FindDoctorsPage;