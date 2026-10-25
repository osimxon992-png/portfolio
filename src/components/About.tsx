import { useRef } from 'react';
import { gsap, useGSAP, MOTION } from '../lib/gsap';
import { site } from '../data';

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.fromTo(
          '.about-word',
          { opacity: 0.2 },
          { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: '.about-bio', start: 'top 80%', end: 'bottom 45%', scrub: true } },
        );

        const counters = gsap.utils.toArray<HTMLElement>('.stat-value');
        counters.forEach((el) => {
          const n = { v: 0 };
          el.textContent = '0';
          gsap.to(n, {
            v: Number(el.dataset.value),
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => void (el.textContent = String(Math.round(n.v))),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });
        return () => counters.forEach((el) => (el.textContent = el.dataset.value!));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="mx-auto max-w-7xl px-4 py-28 md:px-10 md:py-44">
      <div className="grid gap-10 md:grid-cols-12">
        <h2 id="about-title" data-reveal className="text-sm uppercase tracking-[0.25em] text-accent md:col-span-3">
          01 / About
        </h2>
        <p className="about-bio font-display text-[clamp(1.75rem,4.2vw,3.75rem)] font-semibold leading-[1.15] md:col-span-9">
          {site.bio.split(' ').map((word, i) => (
            <span key={i} className="about-word">
              {word}{' '}
            </span>
          ))}
        </p>
      </div>

      <dl className="mt-24 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-3 md:mt-32">
        {site.stats.map((s) => (
          <div key={s.label} data-reveal className="flex flex-col-reverse gap-2">
            <dt className="text-muted">{s.label}</dt>
            <dd className="font-display text-6xl font-bold md:text-8xl">
              <span className="stat-value" data-value={s.value}>
                {s.value}
              </span>
              <span className="text-accent">{s.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
