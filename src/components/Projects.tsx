import { useRef } from 'react';
import type { PointerEvent } from 'react';
import { gsap, useGSAP, MOTION, DESKTOP, POINTER } from '../lib/gsap';
import { site } from '../data';

// md:motion-safe:* classes = horizontal layout, only when it will actually be pinned (desktop + motion allowed).


export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${DESKTOP} and ${MOTION}`, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - document.documentElement.clientWidth;
        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: root.current, pin: true, scrub: 1, end: () => `+=${distance()}`, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>('.project-img').forEach((img) =>
          gsap.fromTo(img, { xPercent: -8 }, {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true },
          }),
        );
      });

      mm.add(`(max-width: 767px) and ${MOTION}`, () => {
        gsap.utils.toArray<HTMLElement>('.project-img').forEach((img) =>
          gsap.fromTo(img, { yPercent: -8 }, {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          }),
        );
      });

      mm.add(`${DESKTOP} and ${POINTER}`, () => {
        gsap.set(label.current, { xPercent: -50, yPercent: -50 });
        const xTo = gsap.quickTo(label.current, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(label.current, 'y', { duration: 0.5, ease: 'power3' });
        const move = (e: globalThis.PointerEvent) => (xTo(e.clientX), yTo(e.clientY));
        window.addEventListener('pointermove', move);
        return () => window.removeEventListener('pointermove', move);
      });
    },
    { scope: root },
  );

  const toggleLabel = (on: boolean) => (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || innerWidth < 768) return;
    gsap.to(label.current, { scale: on ? 1 : 0, opacity: on ? 1 : 0, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
  };

  return (
    <>
      <section
        ref={root}
        id="projects"
        aria-labelledby="projects-title"
        className={`py-28 md:motion-safe:flex md:motion-safe:h-svh md:motion-safe:flex-col md:motion-safe:justify-center md:motion-safe:py-0`}
      >
        <div className="mx-auto mb-12 w-full max-w-7xl px-4 md:px-10">
          <h2 id="projects-title" data-reveal className="text-sm uppercase tracking-[0.25em] text-accent">
            03 / Selected work
          </h2>
        </div>

        <div
          ref={track}
          className={`flex flex-col gap-16 px-4 md:px-10 md:motion-safe:w-max md:motion-safe:flex-row md:motion-safe:gap-10 md:motion-safe:pr-[10vw]`}
        >
          {site.projects.map((p, i) => (
            <article key={p.title} data-reveal className={`w-full md:motion-safe:w-[min(78vw,calc(58svh*1.5))] md:motion-safe:shrink-0`}>
              <a
                href={p.live ?? p.repo}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${p.title} (opens in new tab)`}
                onPointerEnter={toggleLabel(true)}
                onPointerLeave={toggleLabel(false)}
                className="group block aspect-[3/2] overflow-hidden rounded-2xl bg-white/5"
              >
                <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
                  <img
                    src={p.image}
                    alt={`Screenshot of ${p.title}`}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    className="project-img h-full w-full scale-[1.2] object-cover will-change-transform"
                  />
                </div>
              </a>
              <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <h3 className="font-display text-2xl font-bold md:text-3xl">
                    <span className="mr-3 text-muted">0{i + 1}</span>
                    {p.title}
                  </h3>
                  <p className="mt-2 text-muted">{p.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
                    {p.tech.map((t) => (
                      <li key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wider">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-4 text-sm">
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-accent hover:underline">
                      Live ↗<span className="sr-only"> {p.title} (opens in new tab)</span>
                    </a>
                  )}
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-accent hover:underline">
                      Code ↗<span className="sr-only"> {p.title} (opens in new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div
        ref={label}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 flex size-24 scale-0 items-center justify-center rounded-full bg-accent font-medium text-bg opacity-0 max-md:hidden"
      >
        View
      </div>
    </>
  );
}
