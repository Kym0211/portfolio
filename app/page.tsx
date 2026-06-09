import IntroOverlay from "@/components/IntroOverlay";
import HeroBackground from "@/components/hero/HeroBackground";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Work from "@/components/Work";
import SayHi from "@/components/SayHi";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <HeroBackground />
      {/* composed spotlight + vignette framing the centered content */}
      <div className="stage-glow" aria-hidden="true" />
      <Nav />
      <Hero />
      <main>
        <About />
        <Experience />
        <Work />
        <SayHi />
      </main>
      <Contact />
    </>
  );
}
