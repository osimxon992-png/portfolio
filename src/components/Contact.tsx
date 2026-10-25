import { useRef } from 'react';
import { gsap, useGSAP, MOTION, DESKTOP, POINTER } from '../lib/gsap';
import { site } from '../data';

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const magnet = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        gsap.fromTo(
          '.contact-line',
          { xPercent: (i) => (i % 2 ? 40 : -40), opacity: 0 },
          { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 25%', scrub: true } },
        );
      });

      mm.add(`${DESKTOP} and ${POINTER} and ${MOTION}`, () => {
        const btn = magnet.current!;
        const area = btn.parentElement!;
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
        const move = (e: PointerEvent) => {
          const r = area.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.35);
          yTo((e.clientY - r.top - r.height / 2) * 0.35);
        };
        const leave = () => (xTo(0), yTo(0));
        area.addEventListener('pointermove', move);
        area.addEventListener('pointerleave', leave);
        return () => {
          area.removeEventListener('pointermove', move);
          area.removeEventListener('pointerleave', leave);
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="mx-auto max-w-7xl px-4 py-28 md:px-10 md:py-44">
      <p data-reveal className="mb-8 text-sm uppercase tracking-[0.25em] text-accent">
        05 / Contact
      </p>
      <h2 id="contact-title" className="font-display text-[clamp(2.25rem,9.6vw,7.75rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
        <span className="contact-line block">Let's work</span>
        <span className="contact-line block text-accent">together</span>
      </h2>

      <div className="mt-16 flex flex-col gap-12 md:mt-20 md:flex-row md:items-center md:justify-between">
        {/* Padding gives the magnetic effect a pull radius around the button. */}
        <div className="-m-10 w-fit p-10">
          <a
            ref={magnet}
            href={`mailto:${site.email}`}
            className="inline-flex size-44 flex-col items-center justify-center rounded-full bg-accent text-center font-medium text-bg transition-colors hover:bg-fg md:size-56"
          >
            <span className="font-display text-xl font-bold md:text-2xl">Get in touch</span>
            <span className="mt-1 max-w-[90%] truncate text-xs md:text-sm">{site.email}</span>
          </a>
        </div>

        <ul data-reveal className="flex flex-wrap gap-x-8 gap-y-3 text-lg">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="underline-offset-4 transition-colors hover:text-accent hover:underline">
                {s.label} ↗<span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
