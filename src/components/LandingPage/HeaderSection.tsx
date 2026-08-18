"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Stats Bar", href: "#stats" },
  { label: "Problem Highlights", href: "#problem" },
  // { label: 'FAQ', href: '#faq' },
];

export default function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <Image
              src="/assets/study-circle.png"
              alt="A descriptive caption"
              width={30}
              height={20}
            />
            <span className="text-lg font-bold text-neutral-900">
              study<span className="text-primary-500">Circle</span>
            </span>
          </a>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 hover:text-primary-600  transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <Link
            href="/signin"
            className="rounded-md px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-neutral-200 bg-white"
        >
          <nav className="flex flex-col space-y-1 p-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 hover:text-primary-600"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <a
                href="#login"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-center text-base font-medium text-neutral-800 hover:bg-neutral-100"
              >
                Log in
              </a>
              <a
                href="#signup"
                onClick={() => setMobileOpen(false)}
                className="rounded-md bg-primary-600 px-3 py-2 text-center text-base font-semibold text-white hover:bg-primary-700"
              >
                Sign up
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
