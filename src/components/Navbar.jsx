"use client";

import { useState } from "react";
import { Button, Dropdown, Avatar } from "@heroui/react";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Find Doctors", href: "/find-doctors" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/30 dark:bg-black/30 backdrop-blur-lg backdrop-saturate-150 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-accent">MediCare</span><span> Connect</span>
        </Link>

        <ul className="hidden items-center gap-8 sm:flex">
          {navLinks.slice(0, 5).map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm font-medium">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 sm:flex">
          <Button className="btn border-accent text-accent hover:bg-accent hover:text-white" >
            <Link href={"/login"}>Login</Link>
          </Button>
          <Button className="btn border-accent text-accent hover:bg-accent hover:text-white" >
            <Link href={"/register"}>Register</Link>
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
                  <Link href="/my-profile">My Profile</Link>
                </Dropdown.Item>
                <Dropdown.Item id="logout" textValue="Log Out">
                  <Link href="/logout">Logout</Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>

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
              variant="soft"
              onPress={() => setIsMenuOpen(false)}
            >
              <Link href={'/my-profile'}>My Profile</Link>
            </Button>
            <Button
              as={Link}
              href="/login"
              variant="soft"
              color="accent"
              radius="full"
              onPress={() => setIsMenuOpen(false)}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;