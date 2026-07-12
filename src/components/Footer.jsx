import Link from "next/link";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Find Doctors", href: "/find-doctors" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Dashboard", href: "/dashboard" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.98H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.98A10 10 0 0 0 22 12Z" />
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: (
      <path d="M22 5.9c-.74.33-1.53.55-2.36.65a4.1 4.1 0 0 0 1.8-2.27c-.8.47-1.68.82-2.62 1a4.12 4.12 0 0 0-7 3.75A11.65 11.65 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.27 5.49c-.67-.02-1.3-.2-1.85-.51v.05a4.11 4.11 0 0 0 3.3 4.03c-.6.17-1.24.19-1.83.07a4.12 4.12 0 0 0 3.84 2.86A8.27 8.27 0 0 1 2 18.57a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68l-.01-.53A8.3 8.3 0 0 0 22 5.9Z" />
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.5.01-4.73.07-.97.04-1.5.2-1.85.34-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.36-.3.88-.34 1.85-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.04.97.2 1.5.34 1.85.18.47.4.8.75 1.15.35.35.68.57 1.15.75.36.14.88.3 1.85.34 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.97-.04 1.5-.2 1.85-.34.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.36.3-.88.34-1.85.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.97-.2-1.5-.34-1.85a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.36-.14-.88-.3-1.85-.34-1.23-.06-1.58-.07-4.73-.07Zm0 4.13a4.09 4.09 0 1 1 0 8.18 4.09 4.09 0 0 1 0-8.18Zm0 1.62a2.47 2.47 0 1 0 0 4.94 2.47 2.47 0 0 0 0-4.94Zm5.2-1.8a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0Z" />
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    ),
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-accent">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight text-white">
              <span>MediCare Connect</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-footer-paragraph text-[#334155]">
              Connecting patients with verified, top-rated doctors for reliable
              healthcare — anytime, anywhere.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#334155] text-footer-paragraph transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Contact Information
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[#334155] text-footer-paragraph">
              <li className="flex items-start gap-2.5">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>House 12, Road 5, Dhanmondi, Dhaka 1209</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg
                  className="h-4 w-4 shrink-0 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                <a href="mailto:support@medicareconnect.com" className="hover:text-primary">
                  support@medicareconnect.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg
                  className="h-4 w-4 shrink-0 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
                </svg>
                <a href="tel:+8802912345678" className="hover:text-primary">
                  +880 2-912-345-678
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Hotline */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Emergency Hotline
            </h3>
            <a
              href="tel:999"
              className="mt-4 flex items-center gap-3 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3.5 transition-colors hover:bg-danger/20"
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger/20">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger/40" />
                <svg
                  className="relative h-4 w-4 text-danger"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
                </svg>
              </span>
              <div>
                <p className="text-xs text-[#334155] text-footer-paragraph">24/7 Emergency</p>
                <p className="text-lg font-bold text-[#334155]">999</p>
              </div>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between text-[#334155]">
          <p className="text-xs text-footer-paragraph">
            © {year} MediCareConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-footer-paragraph">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;