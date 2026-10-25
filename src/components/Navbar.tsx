import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { site } from '../data';

export default function Navbar() {
  const header = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  const show = () => gsap.to(header.current, { yPercent: 0, duration: 0.4, ease: 'power3.out', overwrite: true });

  useGSAP(() => {
    gsap.to(bar.current, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

    let hidden = false;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const hide = self.direction === 1 && self.scroll() > 120;
        if (hide === hidden) return;
        hidden = hide;
        gsap.to(header.current, { yPercent: hide ? -100 : 0, duration: 0.4, ease: 'power3.out', overwrite: true });
      },
    });
  });

  // IntersectionObserver instead of ScrollTrigger: a pinned section stays "intersecting" for its whole pin.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px' },
    );
    document.querySelectorAll('main section[id]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={bar} aria-hidden className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-accent" />
      <header ref={header} onFocusCapture={show} className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-bg/70 backdrop-blur-md">
        <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-10">
          <a href="#hero" className="font-display text-lg font-bold tracking-tight">
            {site.name}
            <span className="text-accent">.</span>
          </a>
          <button
            type="button"
            className="rounded-full border border-white/15 px-4 py-1.5 text-sm md:hidden"
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
          <ul
            id="nav-menu"
            className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col gap-1 border-b border-white/5 bg-bg px-4 pb-6 pt-2 md:static md:flex md:flex-row md:gap-8 md:border-0 md:bg-transparent md:p-0`}
          >
            {site.nav.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === id ? 'location' : undefined}
                  className={`block py-2 text-2xl transition-colors md:py-1 md:text-sm ${active === id ? 'text-accent' : 'text-muted hover:text-fg'}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
