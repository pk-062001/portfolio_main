export const site = {
  url: 'https://pk062001-portfolio.vercel.app',
  name: 'Prathamesh Kokkula',
  shortName: 'Prathamesh',
  initials: 'pk',
  role: 'Senior Full-Stack Engineer',
  tagline: 'I design, ship & run production systems end-to-end.',
  intro:
    'Senior full-stack engineer with 3+ years building payment flows, secure authentication and real-time platforms on the MERN stack and the cloud — from the first architecture sketch to the 3 a.m. incident.',
  description:
    'Prathamesh Kokkula is a Senior Full-Stack Engineer in Mumbai building production B2B platforms — multi-gateway payments, JWT/RBAC security, real-time dashboards and cloud infrastructure with React, Node.js, MongoDB and AWS.',
  location: 'Mumbai, India',
  timezone: 'Asia/Kolkata',
  availability: 'Available for senior full-stack roles',
  currently: { label: 'BXI — Barter Exchange of India', role: 'Senior Software Developer' },
  email: 'kprathamesh2001@gmail.com',
  phone: '+91 87790 99074',
  phoneHref: 'tel:+918779099074',
  github: 'https://github.com/pk-062001',
  linkedin: 'https://www.linkedin.com/in/prathameshkokkula',
  resume: '/Prathamesh_Kokkula_Resume.pdf',
  keywords: [
    'Prathamesh Kokkula',
    'Senior Full Stack Developer',
    'MERN Stack Developer Mumbai',
    'Node.js Developer',
    'React Developer',
    'Payment Gateway Integration',
    'Full Stack Engineer India',
  ],
};

export const nav = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Work', href: '/#work' },
  { label: 'Stack', href: '/#stack' },
  { label: 'Contact', href: '/#contact' },
];

export const socials = [
  { label: 'GitHub', href: site.github, icon: 'github' },
  { label: 'LinkedIn', href: site.linkedin, icon: 'linkedin' },
  { label: 'Email', href: `mailto:${site.email}`, icon: 'mail' },
  { label: 'Phone', href: site.phoneHref, icon: 'phone' },
] as const;

export const stats = [
  { value: 3, suffix: '+', label: 'Years shipping production software' },
  { value: 5, suffix: '', label: 'Payment gateways integrated end-to-end' },
  { value: 2, suffix: '', label: 'Security products used by banks' },
  { value: 25, suffix: '%', label: 'Faster page loads after React optimisation' },
];

export const story = [
  'I got into software because I liked seeing an idea turn into something people actually use. These days that means owning products end-to-end — talking to founders, shaping the data model, writing the API contracts, building the UI and keeping the servers healthy after launch.',
  'At BXI we are a two-person engineering team running a live B2B barter marketplace. I built the marketplace and listing modules, wired five payment gateways with webhook reconciliation and failure recovery, and run the AWS & DigitalOcean infrastructure it lives on.',
  'Before that, at Odyssey Technologies, I worked on security products used by banks and enterprises — Snorkel TX, a multi-factor authentication server, and xorkee, a cryptographic signing & passwordless-auth framework. That is where I learned to treat security and reliability as features, not afterthoughts.',
];

export const facts = [
  { label: 'Based in', value: 'Mumbai, India' },
  { label: 'Education', value: 'B.E. Computer Engineering · 9.09 CGPA' },
  { label: 'Focus', value: 'Payments · Auth · Real-time · Cloud' },
  { label: 'Exploring', value: 'Applied AI, RAG & agents' },
];

export const principles = [
  {
    title: 'Own it end-to-end',
    body: 'From requirement to rollback plan. I would rather understand the whole system than hand off a ticket and hope.',
  },
  {
    title: 'Design for failure',
    body: 'Webhooks arrive twice, gateways time out, networks drop. Idempotency, reconciliation and retries are part of the first draft.',
  },
  {
    title: 'Secure by default',
    body: 'RBAC, refresh-token rotation and route-level authorisation are baseline — habits from building banking-grade security products.',
  },
  {
    title: 'Ship small, measure, repeat',
    body: 'Small releases, clear metrics and honest post-mortems beat big-bang launches every time.',
  },
];
