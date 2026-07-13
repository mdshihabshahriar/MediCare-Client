import Image from "next/image";
import Link from "next/link";


const values = [
  {
    title: "Compassion First",
    description:
      "Every feature we build starts with one question — does this make care feel more human?",
    bg: "bg-[#FEE2E2]",
    iconColor: "text-[#DC2626]",
    icon: (
      <path d="M12.1 8.64 12 8.75l-.1-.11C10.14 6.6 6.9 6.6 5.06 8.44a4.5 4.5 0 0 0 0 6.36L12 21.66l6.94-6.86a4.5 4.5 0 0 0 0-6.36c-1.84-1.84-5.08-1.84-6.94 0Z" />
    ),
  },
  {
    title: "Trust & Integrity",
    description:
      "Every doctor on our platform is credential-verified. No shortcuts, no exceptions.",
    bg: "bg-[#DBEAFE]",
    iconColor: "text-[#1D4ED8]",
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Accessible Care",
    description:
      "Quality healthcare shouldn't depend on your zip code or your bank balance.",
    bg: "bg-[#DCFCE7]",
    iconColor: "text-[#15803D]",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10" />
        <path d="M15 9.5c0-1.4-1.34-2.5-3-2.5s-3 1.1-3 2.5 1.34 2.5 3 2.5 3 1.1 3 2.5-1.34 2.5-3 2.5-3-1.1-3-2.5" />
      </>
    ),
  },
  {
    title: "Constant Innovation",
    description:
      "We rebuild what healthcare tech usually gets wrong — starting with speed and simplicity.",
    bg: "bg-[#F3E8FF]",
    iconColor: "text-[#7E22CE]",
    icon: (
      <>
        <path d="M12 2v4" />
        <path d="m6.3 6.3 2.8 2.8" />
        <path d="M2 13h4" />
        <path d="m6.3 19.7 2.8-2.8" />
        <circle cx="12" cy="13" r="4" />
      </>
    ),
  },
];

const team = [
  {
    name: "Dr. Farah Islam",
    role: "Co-Founder & Chief Medical Officer",
    photo: "https://i.pravatar.cc/300?img=45",
  },
  {
    name: "Tanvir Hasan",
    role: "Co-Founder & CEO",
    photo: "https://i.pravatar.cc/300?img=13",
  },
  {
    name: "Nusrat Jahan",
    role: "Head of Product",
    photo: "https://i.pravatar.cc/300?img=28",
  },
  {
    name: "Omar Siddique",
    role: "Head of Engineering",
    photo: "https://i.pravatar.cc/300?img=59",
  },
];

const milestones = [
  { value: "2021", label: "Founded" },
  { value: "500+", label: "Verified Doctors" },
  { value: "20,000+", label: "Patients Served" },
  { value: "8", label: "Cities Covered" },
];


function PageHero() {
  return (
    <section className="px-4 pt-20 pb-16 sm:px-6 sm:pt-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-bold tracking-widest text-[#2563EB]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
          ABOUT US
        </div>
        <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[#0F172A] sm:text-5xl">
          Healthcare that puts{" "}
          <span className="text-accent">people first</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[#64748B]">
          MediCareConnect was built on a simple belief — finding the right
          doctor and getting the care you need should never be complicated.
        </p>
      </div>
    </section>
  );
}

function OurStory() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2rem] shadow-xl">
            <Image
              src="/assets/medical.jpg"
              alt="Our team collaborating"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 shadow-lg sm:-left-10">
            <p className="text-3xl font-extrabold text-[#0F172A]">2021</p>
            <p className="text-xs font-medium text-[#94A3B8]">Founded in Dhaka</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-bold tracking-widest text-[#2563EB]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            OUR STORY
          </div>
          <h2 className="mt-5 text-3xl font-extrabold text-[#0F172A] sm:text-4xl">
            Built from a personal frustration
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#64748B]">
            It started when one of our founders spent three days trying to
            book a simple specialist appointment for a family member —
            endless phone calls, no availability shown, no way to compare
            doctors. We knew there had to be a better way.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#64748B]">
            Today, MediCareConnect connects thousands of patients with
            verified specialists every month — with transparent pricing,
            real-time availability, and digital records that travel with you.
          </p>
        </div>
      </div>
    </section>
  );
}

function Milestones() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 rounded-[2rem] border border-[#E2E8F0] bg-white px-6 py-10 shadow-sm sm:grid-cols-4">
        {milestones.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-3xl font-extrabold text-[#0F172A] sm:text-4xl">
              {item.value}
            </p>
            <p className="mt-1 text-sm font-medium text-[#64748B]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CoreValues() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-bold tracking-widest text-[#2563EB]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            WHAT WE STAND FOR
          </div>
          <h2 className="mt-5 text-3xl font-extrabold text-[#0F172A] sm:text-4xl">
            Our Core Values
          </h2>
          <p className="mt-3 text-[#64748B]">
            The principles that guide every decision we make, from product
            design to partnerships.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${value.bg}`}>
                <svg
                  className={`h-6 w-6 ${value.iconColor}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {value.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-base font-bold text-[#0F172A]">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-bold tracking-widest text-[#2563EB]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            OUR TEAM
          </div>
          <h2 className="mt-5 text-3xl font-extrabold text-[#0F172A] sm:text-4xl">
            The People Behind MediCareConnect
          </h2>
          <p className="mt-3 text-[#64748B]">
            A small team of doctors, engineers, and designers working to make
            healthcare simpler.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full shadow-md sm:h-28 sm:w-28">
                <Image src={member.photo} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-[#0F172A]">
                {member.name}
              </h3>
              <p className="mt-0.5 text-xs text-[#94A3B8]">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-10 sm:py-16 bg-accent"
      >
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Ready to experience better healthcare?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#CBD5E1] sm:text-lg">
          Join thousands of patients who found the right doctor, faster.
        </p>
        <Link
          href="/find-doctors"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-300 px-7 py-3.5 text-sm font-bold text-black transition-colors hover:bg-sky-400 sm:text-base"
        >
          Find a Specialist
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <PageHero />
      <OurStory />
      <Milestones />
      <CoreValues />
      <TeamSection />
      <CtaBanner />
    </main>
  );
}