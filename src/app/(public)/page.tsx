import Container from "@/app/components/layout/Container";
import Hero from "@/app/components/sections/Hero";
import Services from "@/app/components/sections/Services";
import WhyChooseUs from "@/app/components/sections/WhyChooseUs";
import Portfolio from "@/app/components/sections/Portfolio";
import Testimonials from "@/app/components/sections/Testimonials";
import CTA from "@/app/components/sections/CTA";
import Contact from "@/app/components/sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Container>
        <Hero />
        <Services />
        <WhyChooseUs />
        <Portfolio />
        <Testimonials />
        <CTA />
        <Contact />
      </Container>
    </main>
  );
}