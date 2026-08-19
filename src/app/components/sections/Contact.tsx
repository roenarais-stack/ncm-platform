import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";

export default function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-10 lg:px-16">

        <Badge>
          Contact
        </Badge>

        <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to Build Something Exceptional?
        </h2>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
          Book a free consultation and let&apos;s discuss your brand,
          website or automation project.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">

          <Button
            href="mailto:info@novacraftmultimedia.com"
            variant="primary"
          >
            Email Us
          </Button>

          <a
            href="tel:+923156515317"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-900"
          >
            Call Now
          </a>

        </div>

      </div>
    </section>
  );
}