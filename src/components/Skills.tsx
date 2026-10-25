import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION } from '../lib/gsap';
import { site } from '../data';

const half = Math.ceil(site.skills.length / 2);
const rows = [site.skills.slice(0, half), site.skills.slice(half)];

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        // Each track holds two identical halves, so moving it by 50% loops seamlessly.
        const tweens = gsap.utils
          .toArray<HTMLElement>('.marquee-track')
          .map((track, i) =>
            gsap.fromTo(track, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 40, ease: 'none', repeat: -1 }),
          );

        const speed = { s: 1 };
        const apply = () => tweens.forEach((t) => t.timeScale(speed.s));
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 8);
            gsap.to(speed, {
              s: boost,
              duration: 0.2,
              overwrite: true,
              onUpdate: apply,
              onComplete: () => void gsap.to(speed, { s: 1, duration: 1.2, ease: 'power2.out', onUpdate: apply }),
            });
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" aria-labelledby="skills-title" className="py-28 md:py-40">
      <div className="mx-auto mb-14 max-w-7xl px-4 md:px-10">
        <h2 id="skills-title" data-reveal className="text-sm uppercase tracking-[0.25em] text-accent">
          02 / Skills
        </h2>
      </div>

      {/* Static list for screen readers, and the visible version when reduced motion is on. */}
      <ul className="sr-only motion-reduce:not-sr-only motion-reduce:mx-auto motion-reduce:flex motion-reduce:max-w-7xl motion-reduce:flex-wrap motion-reduce:gap-3 motion-reduce:px-4 md:motion-reduce:px-10">
        {site.skills.map((s) => (
          <li key={s} className="rounded-full border border-white/15 px-5 py-2 text-lg">
            {s}
          </li>
        ))}
      </ul>

      <div aria-hidden className="space-y-2 motion-reduce:hidden md:space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="overflow-hidden">
            <div className="marquee-track flex w-max will-change-transform">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0">
                  {[...row, ...row].map((s, j) => (
                    <span
                      key={j}
                      className={`flex items-center gap-8 pr-8 font-display text-5xl font-bold uppercase md:gap-14 md:pr-14 md:text-8xl ${i % 2 ? 'text-transparent [-webkit-text-stroke:1px_#f5f5f4]' : ''}`}
                    >
                      {s}
                      <span className="text-3xl text-accent md:text-5xl">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
