export interface Role {
  company: string;
  companyUrl?: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  context: string;
  wins: string[];
  products?: { name: string; url?: string; blurb: string }[];
  stack: string[];
}

export const experience: Role[] = [
  {
    company: 'BXI — Barter Exchange of India',
    role: 'Senior Software Developer',
    period: 'Aug 2025 — Present',
    location: 'Mumbai',
    current: true,
    context:
      'Primary full-stack owner of a live B2B barter marketplace in a two-person team — architecture, build, deployment and on-call are all on us. Promoted to Senior for independently owning business-critical features.',
    wins: [
      'Built the **marketplace and listing modules** from scratch — data model, REST APIs and React UI — for buyers, sellers and admins.',
      'Architected **multi-gateway payments** across Razorpay, Pine Labs, HDFC, Yes Bank and Juspay: order creation, webhook processing, reconciliation and failure recovery.',
      'Designed **RBAC with JWT and refresh-token rotation** to secure buyer, seller and admin roles.',
      'Shipped a **real-time admin dashboard** with order and transaction management, filterable exports and business analytics.',
      'Wired **multi-channel notifications** (NodeMailer, MSG91, Firebase) into the order lifecycle; run **AWS & DigitalOcean** infrastructure, uptime monitoring and incident response.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS', 'DigitalOcean', 'Juspay', 'Razorpay', 'Firebase'],
  },
  {
    company: 'Odyssey Technologies',
    companyUrl: 'https://www.odysseytec.com/',
    role: 'Software Developer',
    period: 'Jul 2023 — Jul 2025',
    location: 'Mumbai',
    context:
      'Worked on digital-security products used by banks, enterprises and government workflows — authentication, digital signatures and transaction security.',
    wins: [
      'Built and maintained **10+ RESTful APIs** in Node.js/Express powering authentication and security workflows, speeding feature delivery by **35%**.',
      'Implemented **RBAC, JWT session validation and route-level authorisation** middleware across every protected endpoint.',
      'Optimised React components and rendering logic, cutting **page load time by 25%**.',
      'Fixed CI/CD pipeline issues across staging and production, improving **uptime and release speed by 30%**.',
    ],
    products: [
      {
        name: 'Snorkel TX',
        url: 'https://www.odysseytec.com/Snorkel-TX/',
        blurb: 'Multi-factor authentication server for internet banking & e-commerce — two-factor auth, channel security, digital signatures and audit trails.',
      },
      {
        name: 'xorkee',
        url: 'https://www.odysseytec.com/xorkee-service/',
        blurb: 'Digital-identity framework for document & email signing and passwordless, OTP-free cryptographic login.',
      },
    ],
    stack: ['Node.js', 'Express', 'React', 'JWT', 'REST APIs', 'CI/CD', 'Docker'],
  },
];

export const education = {
  degree: 'B.E. Computer Engineering',
  school: 'PVPPCOE, University of Mumbai',
  period: '2019 — 2023',
  note: 'CGPA 9.09 / 10',
};
