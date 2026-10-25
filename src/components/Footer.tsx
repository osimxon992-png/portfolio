import type { CSSProperties } from 'react';
import { site } from '../data';

const nameChars = Math.max(...site.name.split(' ').map((w) => w.length));

// The fixed footer sits under the page; the clip-path wrapper only exposes it once the content above scrolls away.
export default function Footer() {
  // Clipped links are invisible until the end of the page, so jump there when a keyboard user tabs in.
  const revealOnFocus = () => window.scrollTo({ top: document.documentElement.scrollHeight });

  return (
    <div className="relative h-[var(--footer-h)] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]">
      <footer onFocusCapture={revealOnFocus} className="fixed bottom-0 left-0 flex h-[var(--footer-h)] w-full flex-col justify-between bg-accent px-4 py-10 text-bg md:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap justify-between gap-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-medium">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="hover:underline focus-visible:outline-bg">
                  {s.label}
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#hero" className="font-medium hover:underline focus-visible:outline-bg">
            Back to top ↑
          </a>
        </div>
        <div className="mx-auto w-full max-w-7xl">
          <p className="fit-name font-display font-extrabold uppercase leading-[0.85] tracking-tight" style={{ '--chars': nameChars } as CSSProperties}>
            {site.name}
          </p>
          <p className="mt-4 text-sm">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
