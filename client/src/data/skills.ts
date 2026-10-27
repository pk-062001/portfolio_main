export interface SkillGroup {
  title: string;
  blurb: string;
  items: string[];
  featured?: boolean;
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'APIs & backend systems',
    blurb: 'Contract-first REST APIs, real-time events and the middleware that keeps them safe.',
    items: ['Node.js', 'Express.js', 'REST API design', 'Socket.io', 'JWT & RBAC', 'Microservices', 'MVC'],
    featured: true,
  },
  {
    title: 'Payments & integrations',
    blurb: 'Order lifecycles, webhooks, reconciliation and recovery.',
    items: ['Razorpay', 'Pine Labs', 'HDFC', 'Yes Bank', 'Juspay', 'MSG91', 'Firebase', 'NodeMailer'],
  },
  {
    title: 'Interfaces',
    blurb: 'Fast, accessible React front-ends and dashboards.',
    items: ['React.js', 'Redux', 'Tailwind CSS', 'Framer Motion', 'Astro', 'Recharts', 'Leaflet'],
  },
  {
    title: 'Data',
    blurb: 'Schemas that survive growth.',
    items: ['MongoDB Atlas', 'Mongoose', 'Aggregations', 'MySQL', 'Multi-tenant modelling'],
  },
  {
    title: 'Cloud & delivery',
    blurb: 'Deploy, observe, recover.',
    items: ['AWS', 'DigitalOcean', 'Docker', 'GitHub Actions', 'PM2', 'CI/CD', 'Incident response'],
  },
  {
    title: 'Languages',
    blurb: 'Daily drivers and foundations.',
    items: ['JavaScript (ES6+)', 'Java', 'SQL', 'Bash', 'HTML5', 'CSS3'],
  },
  {
    title: 'Applied AI',
    blurb: 'Currently going deep on practical, product-grade AI.',
    items: ['LLM integrations', 'Prompt design', 'RAG pipelines', 'AI agents'],
  },
];

export const marquee = [
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'Socket.io',
  'AWS',
  'DigitalOcean',
  'Docker',
  'Razorpay',
  'Juspay',
  'JWT · RBAC',
  'GitHub Actions',
  'Redux',
  'Tailwind',
  'Applied AI',
];
