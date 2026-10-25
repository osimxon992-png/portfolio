import { useRef } from 'react';
import { gsap, useGSAP, MOTION } from '../lib/gsap';
import { site } from '../data';

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.fromTo(
          '.timeline-line',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((el) =>
          gsap.from(el, { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" aria-labelledby="experience-title" className="mx-auto max-w-7xl px-4 py-28 md:px-10 md:py-44">
      <div className="grid gap-12 md:grid-cols-12">
        <h2 id="experience-title" data-reveal className="text-sm uppercase tracking-[0.25em] text-accent md:col-span-3">
          04 / Experience
        </h2>

        <ol className="timeline relative pl-10 md:col-span-9 md:pl-16">
          <svg aria-hidden className="absolute left-0 top-0 h-full w-0.5 overflow-visible">
            <line x1="1" x2="1" y1="0" y2="100%" strokeWidth="2" className="stroke-white/10" />
            <line x1="1" x2="1" y1="0" y2="100%" strokeWidth="2" pathLength={1} strokeDasharray={1} className="timeline-line stroke-accent" />
          </svg>

          {site.experience.map((e) => (
            <li key={e.company + e.period} className="timeline-item relative pb-16 last:pb-0">
              <span aria-hidden className="absolute -left-10 top-2.5 size-3 -translate-x-[5px] rounded-full bg-accent ring-4 ring-bg md:-left-16" />
              <p className="text-sm uppercase tracking-[0.2em] text-muted">{e.period}</p>
              <h3 className="mt-3 font-display text-3xl font-bold md:text-5xl">{e.role}</h3>
              <p className="mt-1 text-lg text-accent">{e.company}</p>
              <p className="mt-4 max-w-2xl text-muted">{e.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
