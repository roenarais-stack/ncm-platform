import Badge from "@/app/components/ui/Badge";

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center py-14 sm:py-20 lg:py-24">
      <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

        {/* Left Side */}
        <div>
          <Badge className="mb-6">
            Digital Solutions That Drive Real Growth
          </Badge>

          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            We Build Businesses.
            <span className="block text-blue-600">
              Not Just Brands.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            NCM helps ambitious businesses grow through strategic branding,
            high-performance websites, digital marketing, AI automation,
            and technology solutions that deliver measurable results.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
            >
              Book Free Consultation
            </a>

            <a
              href="#portfolio"
              className="rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-600 hover:text-blue-600"
            >
              View Our Work
            </a>
          </div>

          {/* Trust Line */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span>Strategy First</span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

            <span>Premium Execution</span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

            <span>Long-Term Growth</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-4 shadow-sm sm:p-6">

          {/* Dashboard */}
          <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white sm:p-6">

            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">
                NCM Dashboard
              </span>

              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium">
                Live Preview
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:bg-white/15">
                <p className="text-sm text-slate-300">
                  Projects Delivered
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight">
                  100+
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:bg-white/15">
                <p className="text-sm text-slate-300">
                  Happy Clients
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight">
                  50+
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:bg-white/15">
                <p className="text-sm text-slate-300">
                  Service Categories
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight">
                  5+
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:bg-white/15">
                <p className="text-sm text-slate-300">
                  Commitment
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight">
                  100%
                </p>
              </div>

            </div>
          </div>

          {/* Service Highlights */}
          <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">
                Branding
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Identity systems that build trust.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">
                Web Development
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Fast, responsive, conversion-focused sites.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">
                AI Automation
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Smarter workflows for modern business.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}