// Canonical content - Armtronix Group (armtronix.com), Malaysian integrated
// infrastructure enterprise. Sourced via fetch Oct 2026 from:
// / (hero, ecosystem, advantage, delivering, industries),
// /about (mission, vision, divisions, leadership, regions),
// /integrated (construction flow + deliverables),
// /engineering_excellence, /power_transmission, /intelligence (deliver lists + stats),
// /contact (HQ, phone, email). Do not invent numbers.

export const site = {
  name: 'Armtronix',
  group: 'Armtronix Group',
  tagline: 'Engineering Intelligent Infrastructure For A Connected Future',
  heroTitleA: 'Bridging Physical Foundations',
  heroTitleB: 'and Digital Frontiers',
  heroSub:
    'Where infrastructure is no longer just a building or a network, Armtronix Group weaves it all into a single, intelligent ecosystem - seamless integration of physical reliability and digital agility.',
  ctas: [
    { label: 'Explore Our Ecosystem', href: '#ecosystem' },
    { label: 'Start Your Project', href: '#contact' },
  ],
  nav: [
    { href: '#ecosystem', label: 'Ecosystem' },
    { href: '#lifecycle', label: 'Lifecycle' },
    { href: '#delivery', label: 'Delivery' },
    { href: '#advantage', label: 'Advantage' },
    { href: '#work', label: 'Work' },
    { href: '#contact', label: 'Contact' },
  ],
  source: 'https://armtronix.com/',
  linkedin: 'https://www.linkedin.com/company/armtronix/',
}

export const pillars = [
  {
    id: 'construction',
    name: 'Armtronix Construction',
    phase: 'Foundation',
    desc: 'Delivering G7-grade industrial shells and heavy civil infrastructure.',
    points: ['Digital construction planning', 'Smart infrastructure integration', 'Structural optimization', 'Construction safety systems'],
    source: 'https://armtronix.com/integrated',
  },
  {
    id: 'engineering',
    name: 'Armtronix Engineering',
    phase: 'Systemization',
    desc: 'Integrating HVAC, vertical transport, and intelligent fire suppression systems.',
    points: ['M&E systems engineering', 'Cooling & thermal management', 'High-capacity power systems', 'Data centre environments'],
    stat: { value: '42% increase', note: 'operational continuity by design' },
    source: 'https://armtronix.com/engineering_excellence',
  },
  {
    id: 'transmission',
    name: 'Armtronix Transmission',
    phase: 'Connectivity',
    desc: 'Providing high-voltage power and 5G utility interconnections.',
    points: ['Fiber & structured cabling', 'High-capacity power transmission', 'Redundant comms networks', 'Utility & telecom coordination'],
    stat: { value: 'Up to 400G', note: 'future-proof backbone capacity' },
    source: 'https://armtronix.com/power_transmission',
  },
  {
    id: 'technologies',
    name: 'Armtronix Technologies',
    phase: 'Intelligence',
    desc: 'Deploying secure cloud architecture, cybersecurity frameworks, and IIoT stacks.',
    points: ['AI-powered automation', 'IoT-enabled monitoring', 'Predictive analytics & reporting', 'Command & control systems'],
    stat: { value: '60% faster', note: 'automated operations with AI' },
    source: 'https://armtronix.com/intelligence',
  },
]

// The lifecycle pipeline - the "structure / data-processing" backbone of the
// redesign. Mirrors armtronix.com's How We Work: every division runs a
// 5-stage flow ending in Optimize; construction flow is the canonical one.
export const lifecycle = {
  kicker: 'How infrastructure flows',
  title: 'One lifecycle. Five stages. Zero fragments.',
  lede: 'Every engagement runs as a coordinated pipeline - strategy, engineering, construction, systems integration and operational readiness in one motion. Select a division to see its flow.',
  flows: {
    construction: ['Discovery', 'Architecture', 'Design', 'Build', 'Optimize'],
    engineering: ['Assess', 'Engineer', 'Validate', 'Integrate', 'Optimize'],
    transmission: ['Assess', 'Plan', 'Integrate', 'Deploy', 'Optimize'],
    technologies: ['Analyze', 'Strategize', 'Integrate', 'Automate', 'Optimize'],
  },
  note: 'No fragmented infrastructure delivery - everything operates as one coordinated ecosystem.',
}

export const advantage = [
  { n: '01', title: 'Single Point of Accountability', desc: 'One coordinated ecosystem from foundation to frontier - no fragmented vendors.' },
  { n: '02', title: 'Integrated Civil + Digital Expertise', desc: 'Construction, engineering, transmission and technologies under centralized governance.' },
  { n: '03', title: 'AI-Driven Predictive Infrastructure', desc: 'Technology enhances thinking - it doesn’t replace it. Predictive monitoring, real-time analytics.' },
  { n: '04', title: 'High-Security Data & Power Systems', desc: 'Engineered for uptime, redundancy and continuous mission-critical performance.' },
  { n: '05', title: 'Sustainable & Energy-Efficient Solutions', desc: 'Lifecycle-optimized design supporting expansion and evolving workloads.' },
]

export const delivering = [
  {
    title: 'Mission-Critical Infrastructure Development',
    desc: 'Large-scale environments engineered for high-density compute and continuous operations.',
  },
  {
    title: 'Integrated Mechatronics Engineering',
    desc: 'Advanced power, cooling and automation systems deployed within complex environments.',
  },
  {
    title: 'Energy & Connectivity Transmission',
    desc: 'High-capacity power and fiber infrastructure connecting facilities to grid and carrier networks.',
  },
]

export const industries = [
  'Data Centres',
  'Industrial Facilities',
  'Smart Buildings',
  'Telecommunications',
  'Government Infrastructure',
  'Energy Infrastructure',
  'High-Security Facilities',
]

export const about = {
  heading: 'Built for Mission-Critical Infrastructure',
  body: 'Armtronix is an integrated infrastructure enterprise delivering the full lifecycle of mission-critical environments with a strategic focus on data centres and critical infrastructure. Through centralized governance and specialized divisions, the group unifies construction, engineering, transmission, and digital technologies into one coordinated ecosystem.',
  mission: 'To deliver integrated infrastructure solutions that combine engineering precision, digital intelligence, and operational reliability for mission-critical environments worldwide.',
  vision: 'To become a global leader in Engineered Intelligence by creating resilient, future-ready environments where physical and digital systems operate seamlessly as one intelligent ecosystem.',
  regions: [
    { place: 'Malaysia', role: 'Strategic HQ - systems integration, governance, digital sovereignty.' },
    { place: 'Australia - Armtronix Pty Ltd', role: 'High-security datacenter operations and cloud environments.' },
    { place: 'India - Armtronix Pvt Ltd', role: 'Global software powerhouse, innovation and R&D hub.' },
  ],
}

export const contact = {
  heading: 'Schedule a complimentary consultation with our design team',
  phone: '+6012 699 1921',
  phoneHref: 'tel:+60126991921',
  email: 'sales@armtronix.one',
  hq: 'Premier Suite 1501, One Mont Kiara, Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur, Malaysia',
  northOps: '2A-G, 2A-1 & 2A-2, Jalan Vervea 10, Bandar Cassia, Aspen Vision City, 14110 Penang',
}

// Image-led storytelling. Imagery hotlinks the company's own published
// assets (armtronix.com/assets/images/*) - no stock, no invention.
const IMG = 'https://armtronix.com/assets/images'

export const stages = [
  {
    n: '01',
    name: 'Construction',
    phase: 'Foundation',
    img: `${IMG}/Construction.webp`,
    alt: 'Armtronix construction - industrial foundation works',
    desc: 'G7-grade industrial shells and heavy civil infrastructure, planned in BIM and built for uptime.',
    capability: 'Digital construction planning',
    href: 'https://armtronix.com/integrated',
  },
  {
    n: '02',
    name: 'Engineering',
    phase: 'Systemization',
    img: `${IMG}/Engineering.webp`,
    alt: 'Armtronix engineering - integrated building systems',
    desc: 'HVAC, vertical transport and intelligent fire suppression engineered as one coordinated system.',
    capability: 'M&E systems engineering',
    href: 'https://armtronix.com/engineering_excellence',
  },
  {
    n: '03',
    name: 'Transmission',
    phase: 'Connectivity',
    img: `${IMG}/Transmission1.webp`,
    alt: 'Armtronix transmission - high-voltage connectivity',
    desc: 'High-voltage power and 5G utility interconnections with redundant, scalable architecture.',
    capability: 'Up to 400G backbone capacity',
    href: 'https://armtronix.com/power_transmission',
  },
  {
    n: '04',
    name: 'Technologies',
    phase: 'Intelligence',
    img: `${IMG}/Technologies.webp`,
    alt: 'Armtronix technologies - intelligent digital systems',
    desc: 'Secure cloud, cybersecurity and IIoT stacks driving automation and predictive operations.',
    capability: '60% faster automated operations',
    href: 'https://armtronix.com/intelligence',
  },
]

export const transition = [
  {
    phase: 'Physical',
    img: `${IMG}/Construction.webp`,
    alt: 'Physical infrastructure - construction foundations',
    line: 'Built foundations. G7-grade shells and civil works engineered for resilience.',
  },
  {
    phase: 'Engineered',
    img: `${IMG}/Engineering.webp`,
    alt: 'Engineered systems - mechanical and electrical integration',
    line: 'Systems engineered. Power, cooling and mechanical plant coordinated as one.',
  },
  {
    phase: 'Connected',
    img: `${IMG}/power.webp`,
    alt: 'Connected infrastructure - power transmission networks',
    line: 'Networks energized. High-voltage distribution and fiber connectivity unified.',
  },
  {
    phase: 'Intelligent',
    img: `${IMG}/Intelligence1.webp`,
    alt: 'Intelligent operations - digital monitoring and automation',
    line: 'Operations awakened. AI automation, IoT monitoring and predictive analytics.',
  },
]

export const deliveryStages = [
  { name: 'Discovery', desc: 'Operational requirements, constraints and continuity targets defined up front.', img: `${IMG}/Infrastructure1.webp`, alt: 'Discovery - infrastructure planning' },
  { name: 'Architecture', desc: 'Civil, systems and network design aligned in a unified delivery framework.', img: `${IMG}/abt1.webp`, alt: 'Architecture - coordinated design' },
  { name: 'Design', desc: 'Coordinated engineering, utility planning and lifecycle-ready detailing.', img: `${IMG}/abt2.webp`, alt: 'Design - engineering detail' },
  { name: 'Build', desc: 'Mission-critical construction with integrated systems installation.', img: `${IMG}/Delivering.webp`, alt: 'Build - mission-critical construction' },
  { name: 'Optimize', desc: 'Commissioning, monitoring and lifecycle performance optimization.', img: `${IMG}/Future.webp`, alt: 'Optimize - future-ready operations' },
]

export const whyImagery = {
  'Single Point of Accountability': `${IMG}/Driven.webp`,
  'Integrated Civil + Digital Expertise': `${IMG}/abt1.webp`,
  'AI-Driven Predictive Infrastructure': `${IMG}/Technologies.webp`,
  'High-Security Data & Power Systems': `${IMG}/Transmission1.webp`,
  'Sustainable & Energy-Efficient Solutions': `${IMG}/Future.webp`,
}

export const cases = [
  {
    type: 'Mission-critical infrastructure',
    title: 'High-density compute environments',
    capability: 'Integrated construction + engineering',
    outcome: 'Large-scale facilities engineered for continuous operations.',
    img: `${IMG}/Delivering.webp`,
    alt: 'Mission-critical infrastructure project',
  },
  {
    type: 'Mechatronics engineering',
    title: 'Power, cooling and automation at scale',
    capability: 'M&E systems + building intelligence',
    outcome: 'Advanced engineering systems deployed in complex environments.',
    img: `${IMG}/Delivering1.webp`,
    alt: 'Integrated mechatronics engineering systems',
  },
  {
    type: 'Energy & connectivity',
    title: 'Grid and carrier interconnection',
    capability: 'High-voltage transmission + fiber',
    outcome: 'Facilities connected to national grid and carrier networks.',
    img: `${IMG}/Delivering2.webp`,
    alt: 'High-capacity energy and connectivity transmission',
  },
]

export const industryImagery = [
  `${IMG}/Future.webp`,
  `${IMG}/Construction.webp`,
  `${IMG}/abt2.webp`,
  `${IMG}/Transmission1.webp`,
  `${IMG}/Driven.webp`,
  `${IMG}/power.webp`,
  `${IMG}/Engineering.webp`,
]
