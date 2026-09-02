export const dashboardNav = [
  // ------------------------- PATIENT -------------------------
  {
    label: "Overview",
    href: "/dashboard/patient",
    roles: ["patient"],
    icon: "grid",
  },
  {
    label: "My Profile",
    href: "/dashboard/patient/profile",
    roles: ["patient"],
    icon: "user",
  },
  {
    label: "My Appointments",
    href: "/dashboard/patient/appointments",
    roles: ["patient"],
    icon: "calendar",
  },
  {
    label: "My Prescriptions",
    href: "/dashboard/patient/prescriptions",
    roles: ["patient"],
    icon: "file",
  },
  {
    label: "Payment History",
    href: "/dashboard/patient/payments",
    roles: ["patient"],
    icon: "card",
  },
  {
    label: "My Reviews",
    href: "/dashboard/patient/reviews",
    roles: ["patient"],
    icon: "star",
  },

  // -------------------------- DOCTOR --------------------------
  {
    label: "Overview",
    href: "/dashboard/doctor",
    roles: ["doctor"],
    icon: "grid",
  },
  {
    label: "Manage Schedule",
    href: "/dashboard/doctor/schedule",
    roles: ["doctor"],
    icon: "calendar",
  },
  {
    label: "Appointment Requests",
    href: "/dashboard/doctor/requests",
    roles: ["doctor"],
    icon: "inbox",
  },
  {
    label: "Prescriptions",
    href: "/dashboard/doctor/prescriptions",
    roles: ["doctor"],
    icon: "file",
  },
  {
    label: "Profile Management",
    href: "/dashboard/doctor/profile",
    roles: ["doctor"],
    icon: "user",
  },

  // -------------------------- ADMIN ---------------------------
  {
    label: "Overview",
    href: "/dashboard/admin",
    roles: ["admin"],
    icon: "grid",
  },
  {
    label: "Manage Users",
    href: "/dashboard/admin/users",
    roles: ["admin"],
    icon: "users",
  },
  {
    label: "Manage Doctors",
    href: "/dashboard/admin/doctors",
    roles: ["admin"],
    icon: "badge",
  },
  {
    label: "Manage Appointments",
    href: "/dashboard/admin/appointments",
    roles: ["admin"],
    icon: "calendar",
  },
  {
    label: "Payment Management",
    href: "/dashboard/admin/payments",
    roles: ["admin"],
    icon: "card",
  },
  {
    label: "Analytics",
    href: "/dashboard/admin/analytics",
    roles: ["admin"],
    icon: "chart",
  },
];

// Helper — call this with the logged-in user's role.
export function getNavForRole(role) {
  return dashboardNav.filter((item) => item.roles.includes(role));
}