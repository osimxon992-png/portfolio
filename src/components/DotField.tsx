import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

const GAP = 28; // grid spacing, px
const RADIUS = 150; // cursor influence radius, px
const PUSH = 28; // max cursor displacement, px
const RIPPLE_MS = 1400;

type Dot = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; g: number };

// Interactive dot grid for the hero: dots spring away from the cursor and glow in the accent colour; a click/tap sends a shockwave.
export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const host = canvas.parentElement!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0, on: false };
    const ripples: { x: number; y: number; t: number }[] = [];
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(245,245,244,0.16)';
      ctx.beginPath();
      for (const d of dots) if (d.g < 0.02) ctx.rect(d.x + d.ox - 1, d.y + d.oy - 1, 2, 2);
      ctx.fill();
      for (const d of dots) {
        if (d.g < 0.02) continue;
        ctx.fillStyle = `rgba(155,123,255,${0.25 + d.g * 0.75})`; // --color-accent
        ctx.beginPath();
        ctx.arc(d.x + d.ox, d.y + d.oy, 1 + d.g * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = ((h % GAP) + GAP) / 2; y < h; y += GAP)
        for (let x = ((w % GAP) + GAP) / 2; x < w; x += GAP) dots.push({ x, y, ox: 0, oy: 0, vx: 0, vy: 0, g: 0 });
      draw();
    };

    const step = () => {
      if (!visible) return;
      const now = performance.now();
      while (ripples.length && now - ripples[0].t > RIPPLE_MS) ripples.shift();
      const reach = Math.hypot(w, h);
      let moving = false;

      for (const d of dots) {
        let tx = 0;
        let ty = 0;
        let g = 0;
        if (pointer.on) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < RADIUS) {
            const f = 1 - dist / RADIUS;
            tx += (dx / dist) * f * f * PUSH;
            ty += (dy / dist) * f * f * PUSH;
            g = f;
          }
        }
        for (const r of ripples) {
          const age = (now - r.t) / RIPPLE_MS;
          const dx = d.x - r.x;
          const dy = d.y - r.y;
          const dist = Math.hypot(dx, dy) || 1;
          const band = 1 - Math.abs(dist - age * reach * 0.7) / 70; // ring ~70px thick
          if (band <= 0) continue;
          const f = band * (1 - age);
          tx += (dx / dist) * f * 34;
          ty += (dy / dist) * f * 34;
          g = Math.max(g, f);
        }
        // Damped spring toward the target offset.
        d.vx = (d.vx + (tx - d.ox) * 0.14) * 0.8;
        d.vy = (d.vy + (ty - d.oy) * 0.14) * 0.8;
        d.ox += d.vx;
        d.oy += d.vy;
        d.g += (g - d.g) * 0.25;
        if (Math.abs(d.vx) + Math.abs(d.vy) > 0.01 || d.g > 0.01) moving = true;
      }
      // Idle grid: skip the redraw to save battery.
      if (moving || pointer.on || ripples.length) draw();
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return; // touch: taps make ripples, dragging scrolls
      Object.assign(pointer, local(e), { on: true });
    };
    const onLeave = () => (pointer.on = false);
    const onDown = (e: PointerEvent) => ripples.push({ ...local(e), t: performance.now() });

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (reduce) return () => ro.disconnect();

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerdown', onDown);
    gsap.ticker.add(step);
    return () => {
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
      gsap.ticker.remove(step);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
