"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Button, Link, Dropdown, Avatar, Label } from "@heroui/react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Find Doctors", href: "/find-doctors" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Dashboard", href: "/dashboard" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/30 dark:bg-black/30 backdrop-blur-lg backdrop-saturate-150 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo (text only) */}
        <NextLink href="/" className="text-xl font-bold tracking-tight">
          <span className="text-accent">MediCare</span><span> Connect</span>
        </NextLink>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm font-medium">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: auth + profile (desktop) */}
        <div className="hidden items-center gap-4 sm:flex">
          <Button as={NextLink} href="/login" variant="soft" color="accent" radius="full">
            Login / Register
          </Button>

          <Dropdown>
            <Dropdown.Trigger className="rounded-full">
              <Avatar size="sm">
                <Avatar.Image alt="User" src="https://i.pravatar.cc/150?u=user" />
                <Avatar.Fallback delayMs={600}>U</Avatar.Fallback>
              </Avatar>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <div className="flex items-center gap-2 px-3 pb-1 pt-3">
                <Avatar size="sm">
                  <Avatar.Image alt="User" src="https://i.pravatar.cc/150?u=user" />
                  <Avatar.Fallback delayMs={600}>U</Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-5">Signed in as</p>
                  <p className="text-muted text-xs leading-none">user@example.com</p>
                </div>
              </div>
              <Dropdown.Menu aria-label="Profile actions">
                <Dropdown.Item id="my-profile" textValue="My Profile">
                  <Label>My Profile</Label>
                </Dropdown.Item>
                <Dropdown.Item id="logout" textValue="Log Out">
                  <Label>Logout</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>

        {/* Hamburger toggle (mobile only) */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-foreground transition-transform duration-200 ${
              isMenuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition-opacity duration-200 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition-transform duration-200 ${
              isMenuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-lg sm:hidden">
          <ul className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-base font-medium"
                  onPress={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-4 border-t border-white/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <Avatar.Image alt="User" src="https://i.pravatar.cc/150?u=user" />
                <Avatar.Fallback delayMs={600}>U</Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium leading-5">Signed in as</p>
                <p className="text-muted text-xs leading-none">user@example.com</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-4 pb-4">
            <Button
              as={NextLink}
              href="/my-profile"
              variant="soft"
              onPress={() => setIsMenuOpen(false)}
            >
              My Profile
            </Button>
            <Button
              as={NextLink}
              href="/login"
              variant="soft"
              color="accent"
              radius="full"
              onPress={() => setIsMenuOpen(false)}
            >
              Login / Register
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;