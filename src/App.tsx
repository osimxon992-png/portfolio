import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, useGSAP, MOTION } from './lib/gsap';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  // Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger and Lenis share one frame loop.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Generic fade + slide up for anything marked data-reveal. Runs after the sections (child effects run first).
  useGSAP(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    gsap.matchMedia().add(MOTION, () => {
      gsap.set('[data-reveal]', { opacity: 0, y: 40 });
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }),
      });
    });
  });

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="relative overflow-x-clip bg-bg">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
