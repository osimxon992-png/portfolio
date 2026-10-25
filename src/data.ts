// All site content lives here. Edit this file; components read from it.
// SEO title/description in index.html are also filled from `site` at build time.

export const site = {
  name: 'Osimxon Dadaxanov',
  role: 'Frontend Developer',
  roles: ['Frontend Developer', 'React Developer', 'YouTube Creator'], // typed one after another in the hero
  photo: '/me.webp', // portrait ~4:5 in /public; transparent background works best
  tagline: 'I build fast, accessible interfaces with motion that feels right.',
  bio: 'I design and engineer web experiences where performance, accessibility and detail meet. For the past few years I have helped startups and studios turn ideas into products people enjoy using, from the first sketch to the last frame of animation.',
  availability: 'Available for new projects', // badge at the top of the hero
  location: 'Uzbekistan',
  timeZone: 'Asia/Tashkent', // for the live clock in the hero
  url: 'https://example.com', // your deployed URL, no trailing slash (used for canonical + OG image)
  email: 'osimxon992@gmail.com',

  nav: [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Work' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ],

  stats: [
    { value: 5, suffix: '+', label: 'Years of experience' },
    { value: 40, suffix: '+', label: 'Projects shipped' },
    { value: 25, suffix: '', label: 'Happy clients' },
  ],

  // First half goes in the top marquee row, second half in the bottom row.
  skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'GSAP', 'Tailwind CSS', 'Three.js', 'GraphQL', 'PostgreSQL', 'Figma', 'Vite', 'Accessibility'],

  // image: put files in /public/projects and reference them as '/projects/name.jpg'
  projects: [
    {
      title: 'DevTips',
      description: 'YouTube channel with short, practical coding tips: Git, HTML, CSS, JavaScript, Python and VS Code, shown before vs after.',
      tech: ['YouTube', 'JavaScript', 'CSS', 'Python'],
      image: '/projects/devtips.png',
      live: 'https://www.youtube.com/@devtipsuz',
    },
    {
      title: 'DevConnect',
      description: 'A noticeboard for developers: share what you build, ask questions, find a team for your project and browse jobs.',
      tech: ['React', 'Vite', 'Vercel'],
      image: '/projects/devconnect.png',
      live: 'https://dev-connect-rho-eight.vercel.app/',
    },
    {
      title: 'Tarqat',
      description: 'Telegram ad marketplace for Uzbekistan with verified channels and payments held until the post has stayed up 24 hours.',
      tech: ['React', 'Vite', 'Tailwind CSS'],
      image: '/projects/tarqat.png',
      live: 'https://tarqatuz.vercel.app/',
    },
    {
      title: 'CV Builder',
      description: 'Guided CV builder with 18 templates and PDF download in Uzbek, Russian and English. No sign-up, stored in the browser.',
      tech: ['React', 'Vite', 'PDF'],
      image: '/projects/cv-builder.png',
      live: 'https://cv-builder-orcin-five.vercel.app/',
    },
  ] as { title: string; description: string; tech: string[]; image: string; live?: string; repo?: string }[],

  experience: [
    { company: 'Acme Studio', role: 'Senior Frontend Developer', period: '2023 — Present', description: 'Lead the frontend of client products, own the design system and motion guidelines.' },
    { company: 'Brightlabs', role: 'Frontend Developer', period: '2021 — 2023', description: 'Built and shipped a React/TypeScript SaaS platform used by 50k+ people.' },
    { company: 'Freelance', role: 'Web Developer', period: '2019 — 2021', description: 'Designed and built websites for small businesses and creators.' },
  ],

  socials: [
    { label: 'GitHub', href: 'https://github.com/osimxon992-png' },
    { label: 'Instagram', href: 'https://www.instagram.com/dadaxanov.26/' },
    { label: 'Telegram', href: 'https://t.me/osimxon_00' },
    { label: 'YouTube (DevTips)', href: 'https://www.youtube.com/@devtipsuz' },
  ],
};
