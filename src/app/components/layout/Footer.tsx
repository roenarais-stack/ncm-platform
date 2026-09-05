import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400">
              NCM
            </h2>

            <p className="mt-4 max-w-sm leading-7 text-slate-400">
              Nova Craft Multimedia helps businesses grow through
              branding, websites, marketing and AI solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">

              <Link
                href="/#services"
                className="text-slate-400 transition hover:text-white"
              >
                Services
              </Link>

              <Link
                href="/#why-us"
                className="text-slate-400 transition hover:text-white"
              >
                Why NCM
              </Link>

              <Link
                href="/portfolio"
                className="text-slate-400 transition hover:text-white"
              >
                Portfolio
              </Link>

              <Link
                href="/#testimonials"
                className="text-slate-400 transition hover:text-white"
              >
                Testimonials
              </Link>

              <Link
                href="/#contact"
                className="text-slate-400 transition hover:text-white"
              >
                Contact
              </Link>

            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">
              Contact
            </h3>

            <a
              href="mailto:info@novacraftmultimedia.com"
              className="block text-slate-400 transition hover:text-white"
            >
              info@novacraftmultimedia.com
            </a>

            <a
              href="tel:+923156515317"
              className="mt-2 block text-slate-400 transition hover:text-white"
            >
              +92 315 6515317
            </a>

            <p className="mt-2 text-slate-400">
              Lahore, Pakistan
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © 2026 NCM — Nova Craft Multimedia. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
