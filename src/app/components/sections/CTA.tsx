import Button from "@/app/components/ui/Button";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="rounded-[2rem] bg-slate-950 px-6 py-16 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Let&apos;s Build Together
          </p>

          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to Take Your Business to the Next Level?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-8 text-slate-300">
            Whether you need a stronger brand, a high-performance website,
            digital marketing, or smart automation, NCM is ready to help you
            build and grow.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="#contact" variant="primary">
              Book Free Consultation
            </Button>

            <Button href="#portfolio" variant="outline">
              Explore Our Work
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}