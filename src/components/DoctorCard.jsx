import Link from "next/link";
import Image from "next/image";

const specialtyBadgeStyles = {
  Cardiology: "bg-[#FEE2E2] text-[#991B1B]",
  Neurology: "bg-[#DBEAFE] text-[#1E3A8A]",
  Orthopedics: "bg-[#DCFCE7] text-[#166534]",
  Pediatrics: "bg-[#FEF3C7] text-[#92400E]",
  Dermatology: "bg-[#FCE7F3] text-[#9D174D]",
};
const defaultBadgeStyle = "bg-[#F1F5F9] text-[#334155]";

// doctor shape:
// { id, name, photo, specialty, qualifications, experience, fee, hospital, rating }
export default function DoctorCard({ doctor }) {
  const { id, name, photo, specialty, qualifications, experience, fee, hospital, rating } = doctor;
  const badgeStyle = specialtyBadgeStyles[specialty] || defaultBadgeStyle;

  return (
    <Link
      href={`/doctors/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Photo */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F1F5F9]">
        <Image
          src={photo}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {rating && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-[#0F172A] shadow-sm backdrop-blur-sm">
            <span className="text-[#F59E0B]">★</span>
            {rating}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}>
          {specialty}
        </span>

        <h3 className="mt-3 text-lg font-bold text-[#0F172A]">{name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#94A3B8]">
          {qualifications}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#64748B]">
          <svg className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          {experience}+ years experience
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
          <span className="line-clamp-1">{hospital}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-4">
          <div>
            <p className="text-xs text-[#94A3B8]">Consultation Fee</p>
            <p className="text-base font-bold text-[#2563EB]">৳{fee}</p>
          </div>
          <span className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-[#1D4ED8]">
            Book Now
          </span>
        </div>
      </div>
    </Link>
  );
}