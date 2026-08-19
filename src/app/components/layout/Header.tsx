"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/app/components/ui/Button";

const navItems = [
  { name: "Services", href: "#services" },
  { name: "Why NCM", href: "#why-us" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          NCM
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button href="#contact" variant="primary">
            Book Consultation
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-900 transition hover:border-blue-600 hover:text-blue-600 md:hidden"
        >
          <span className="text-xl leading-none">
            {menuOpen ? "×" : "☰"}
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-3">
              <Button
                href="#contact"
                variant="primary"
                fullWidth
                onClick={closeMenu}
              >
                Book Consultation
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}