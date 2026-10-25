import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

// gsap.matchMedia queries shared by sections. Effects registered under them revert automatically.
export const MOTION = '(prefers-reduced-motion: no-preference)';
export const DESKTOP = '(min-width: 768px)';
export const POINTER = '(pointer: fine)';
