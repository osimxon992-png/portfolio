import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { gsap, useGSAP, MOTION, POINTER } from '../lib/gsap';
import { site } from '../data';
import DotField from './DotField';

const nameChars = Math.max(...site.name.split(' ').map((w) => w.length));

const clock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: site.timeZone });

// Own component so the ticking clock doesn't re-render the whole hero.
function LocalTime() {
  const [time, setTime] = useState(() => clock.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(clock.format(new Date())), 10_000);
    return () => clearInterval(id);
  }, []);
  return <time>{time} local time</time>;
}

// Typewriter that cycles through site.roles. Screen readers get the plain role instead.
function TypingRole() {
  const [text, setText] = useState(site.roles[0]);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || site.roles.length < 2) return;
    let role = 0;
    let len = site.roles[0].length;
    let deleting = true;
    let id: number;
    const tick = () => {
      if (deleting && --len === 0) {
        deleting = false;
        role = (role + 1) % site.roles.length;
      } else if (!deleting) len++;
      setText(site.roles[role].slice(0, len));
      const typed = !deleting && len === site.roles[role].length;
      if (typed) deleting = true;
      id = window.setTimeout(tick, typed ? 2200 : deleting ? 35 : 75);
    };
    id = window.setTimeout(tick, 3200);
    return () => clearTimeout(id);
  }, []);

  return (
    <p className="hero-fade mb-6 text-sm uppercase tracking-[0.25em] text-accent">
      <span className="sr-only">{site.role}</span>
      <span aria-hidden>
        {text}
        <span className="ml-1 inline-block h-[1.1em] w-0.5 animate-pulse bg-accent align-middle motion-reduce:animate-none" />
      </span>
    </p>
  );
}

// y = how far (px) each shape travels while the hero scrolls out; different values give depth.
const shapes = [
  { y: -260, className: 'left-[-10%] top-[10%] size-[45vw] max-w-[640px] max-h-[640px] rounded-full bg-accent/15 blur-3xl' },
  { y: -520, className: 'right-[8%] top-[18%] size-24 rounded-full border border-accent/60 md:size-40' },
  { y: 180, className: 'right-[-6%] bottom-[12%] size-[30vw] max-w-[420px] max-h-[420px] rounded-full border border-white/10' },
  { y: -380, className: 'left-[55%] bottom-[30%] size-3 rounded-full bg-accent' },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const letters = gsap.utils.toArray<HTMLElement>('.hero-letter');
        const wiggle = (e: Event) =>
          gsap
            .timeline()
            .to(e.currentTarget, { yPercent: -22, rotation: gsap.utils.random(-14, 14), duration: 0.2, ease: 'power2.out', overwrite: true })
            .to(e.currentTarget, { yPercent: 0, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });

        gsap
          .timeline({
            delay: 0.2,
            // Letters only become hoverable once the reveal is done; unclip them so the jump isn't cut off.
            onComplete: () => {
              gsap.set('.hero-word', { overflow: 'visible' });
              letters.forEach((l) => l.addEventListener('pointerenter', wiggle));
            },
          })
          .from(letters, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.04 })
          .from('.hero-photo-card', { opacity: 0, scale: 0.8, rotation: -8, duration: 1.4, ease: 'expo.out' }, 0.3)
          .from('.hero-fade', { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, '-=0.8');

        const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero-content', { scale: 0.85, opacity: 0, yPercent: 30, ease: 'none', scrollTrigger: scrub });
        gsap.to('.hero-photo', { y: -140, ease: 'none', scrollTrigger: scrub });
        gsap.utils.toArray<HTMLElement>('.hero-shape').forEach((el, i) =>
          gsap.to(el, { y: shapes[i].y, ease: 'none', scrollTrigger: scrub }),
        );

        return () => letters.forEach((l) => l.removeEventListener('pointerenter', wiggle));
      });

      // Photo tilts toward the cursor, the image inside drifts the other way for depth.
      gsap.matchMedia().add(`${MOTION} and ${POINTER}`, () => {
        gsap.set('.hero-photo-card', { transformPerspective: 900 });
        const rx = gsap.quickTo('.hero-photo-card', 'rotationX', { duration: 0.8, ease: 'power3' });
        const ry = gsap.quickTo('.hero-photo-card', 'rotationY', { duration: 0.8, ease: 'power3' });
        const ix = gsap.quickTo('.hero-photo-img', 'xPercent', { duration: 0.8, ease: 'power3' });
        const iy = gsap.quickTo('.hero-photo-img', 'yPercent', { duration: 0.8, ease: 'power3' });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / innerWidth - 0.5;
          const ny = e.clientY / innerHeight - 0.5;
          rx(-ny * 18);
          ry(nx * 18);
          ix(-nx * 6);
          iy(-ny * 6);
        };
        const reset = () => [rx, ry, ix, iy].forEach((to) => to(0));
        const section = root.current!;
        section.addEventListener('pointermove', move);
        section.addEventListener('pointerleave', reset);
        return () => {
          section.removeEventListener('pointermove', move);
          section.removeEventListener('pointerleave', reset);
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="hero" aria-label="Intro" className="relative flex min-h-svh flex-col justify-between gap-16 overflow-hidden px-4 pb-16 pt-24 md:px-10 md:pb-20 md:pt-28">
      <DotField />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {shapes.map((s, i) => (
          <div key={i} className={`hero-shape pointer-events-none absolute will-change-transform ${s.className}`} />
        ))}
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 text-sm">
        <p className="hero-fade inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-bg/60 px-4 py-2 backdrop-blur">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {site.availability}
        </p>
        <p className="hero-fade text-muted">
          {site.location} · <LocalTime />
        </p>
      </div>

      <div className="hero-content relative mx-auto w-full max-w-7xl origin-bottom-left">
        <div className="relative">
        {/* Phone: photo sits in the flow above the name. Desktop: right of the first name line;
            it shares the name's font size so bottom: 0.95em = one name line up from the bottom. */}
        <div
          className="hero-photo fit-name mb-10 ml-auto w-[42vw] max-w-56 md:absolute md:bottom-[0.95em] md:right-0 md:mb-0 md:w-[min(20vw,280px)] md:max-w-none"
          style={{ '--chars': nameChars } as CSSProperties}
        >
          <div className="hero-photo-card aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 will-change-transform">
            <img src={site.photo} alt={`Portrait of ${site.name}`} className="hero-photo-img size-full scale-110 object-cover will-change-transform" />
          </div>
        </div>
        <TypingRole />
        <h1 className="fit-name relative font-display font-extrabold uppercase leading-[0.85] tracking-tight" style={{ '--chars': nameChars } as CSSProperties}>
          <span className="sr-only">{site.name}</span>
          <span aria-hidden>
            {site.name.split(' ').map((word, i) => (
              <span key={i} className="hero-word mr-[0.2em] inline-block overflow-hidden whitespace-nowrap pb-[0.06em] align-top last:mr-0">
                {[...word].map((ch, j) => (
                  <span key={j} className="hero-letter inline-block">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>
        </div>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-md text-lg text-muted md:text-xl">{site.tagline}</p>
          <div className="hero-fade flex flex-wrap gap-3">
            <a href="#projects" className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-bg transition-colors hover:bg-fg">
              View my work
              <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a href="#contact" className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 font-medium transition-colors hover:border-accent hover:text-accent">
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
