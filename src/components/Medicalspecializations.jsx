import Link from "next/link";

// Specialization data — colors match the brand's specialization palette
const specializations = [
  {
    name: "Cardiology",
    description: "Heart & vascular care",
    href: "/find-doctors?specialization=cardiology",
    bg: "bg-[#FEE2E2]",
    iconColor: "text-[#DC2626]",
    icon: (
      <path d="M12.1 8.64 12 8.75l-.1-.11C10.14 6.6 6.9 6.6 5.06 8.44a4.5 4.5 0 0 0 0 6.36L12 21.66l6.94-6.86a4.5 4.5 0 0 0 0-6.36c-1.84-1.84-5.08-1.84-6.94 0Z" />
    ),
  },
  {
    name: "Neurology",
    description: "Brain & nervous system",
    href: "/find-doctors?specialization=neurology",
    bg: "bg-[#DBEAFE]",
    iconColor: "text-[#1D4ED8]",
    icon: (
      <>
        <path d="M9.5 2a2.5 2.5 0 0 0-2.45 2.02A2.5 2.5 0 0 0 5 6.5c0 .3.04.58.13.85A3 3 0 0 0 4 10a3 3 0 0 0 1.5 2.6 3 3 0 0 0 2.62 4.4 2.5 2.5 0 0 0 2.38 2.5V4.5A2.5 2.5 0 0 0 9.5 2Z" />
        <path d="M14.5 2a2.5 2.5 0 0 1 2.45 2.02A2.5 2.5 0 0 1 19 6.5c0 .3-.04.58-.13.85A3 3 0 0 1 20 10a3 3 0 0 1-1.5 2.6 3 3 0 0 1-2.62 4.4 2.5 2.5 0 0 1-2.38 2.5V4.5A2.5 2.5 0 0 1 14.5 2Z" />
      </>
    ),
  },
  {
    name: "Orthopedics",
    description: "Bones, joints & muscles",
    href: "/find-doctors?specialization=orthopedics",
    bg: "bg-[#DCFCE7]",
    iconColor: "text-[#15803D]",
    icon: (
      <path d="M17 7a3 3 0 0 0-3 3c0 .35.06.68.16 1H9.84c.1-.32.16-.65.16-1a3 3 0 1 0-3 3c.35 0 .68-.06 1-.16v4.32c-.32-.1-.65-.16-1-.16a3 3 0 1 0 3 3c0-.35-.06-.68-.16-1h4.32c-.1.32-.16.65-.16 1a3 3 0 1 0 3-3c-.35 0-.68.06-1 .16v-4.32c.32.1.65.16 1 .16a3 3 0 0 0 0-6Z" />
    ),
  },
  {
    name: "Pediatrics",
    description: "Child & infant health",
    href: "/find-doctors?specialization=pediatrics",
    bg: "bg-[#FEF3C7]",
    iconColor: "text-[#B45309]",
    icon: (
      <>
        <circle cx="12" cy="9" r="4" />
        <path d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6" />
      </>
    ),
  },
  {
    name: "Dermatology",
    description: "Skin, hair & nails",
    href: "/find-doctors?specialization=dermatology",
    bg: "bg-[#FCE7F3]",
    iconColor: "text-[#BE185D]",
    icon: (
      <path d="M12 2c3.5 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 2.5-7 6-11Z" />
    ),
  },
  {
    name: "Gynecology",
    description: "Women's health",
    href: "/find-doctors?specialization=gynecology",
    bg: "bg-[#F3E8FF]",
    iconColor: "text-[#7E22CE]",
    icon: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="M12 13v8" />
        <path d="M9 18h6" />
      </>
    ),
  },
  {
    name: "ENT",
    description: "Ear, nose & throat",
    href: "/find-doctors?specialization=ent",
    bg: "bg-[#E0F2FE]",
    iconColor: "text-[#0369A1]",
    icon: (
      <path d="M7 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5c0 2-1 3.5-1 5.5a4 4 0 0 1-8 0" />
    ),
  },
  {
    name: "Ophthalmology",
    description: "Eye & vision care",
    href: "/find-doctors?specialization=ophthalmology",
    bg: "bg-[#ECFCCB]",
    iconColor: "text-[#4D7C0F]",
    icon: (
      <>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
];

const MedicalSpecializations = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-heading sm:text-4xl">
            Our Medical Specializations
          </h2>
          <p className="mt-3 text-paragraph">
            Access primary, pediatric, neural, and dermatological healthcare
            resources with validated physician consultants.
          </p>
        </div>

        {/* Specialization grid */}
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {specializations.map((spec) => (
            <Link
              key={spec.name}
              href={spec.href}
              className="group flex flex-col items-center rounded-2xl border border-border bg-bg-card px-5 py-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full ${spec.bg} transition-transform group-hover:scale-110`}
              >
                <svg
                  className={`h-6 w-6 ${spec.iconColor}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {spec.icon}
                </svg>
              </span>

              <h3 className="mt-4 text-base font-bold text-heading">{spec.name}</h3>
              <p className="mt-1 text-xs text-muted">{spec.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MedicalSpecializations;