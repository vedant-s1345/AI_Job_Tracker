// src/demo/demoData.js
// ─── Fake data shown when Demo Mode is active ───────────────────────────────
// Place this file at: frontend/src/demo/demoData.js

const now = new Date();
const daysFromNow = (d) => new Date(now.getTime() + d * 86_400_000).toISOString();
const daysAgo     = (d) => new Date(now.getTime() - d * 86_400_000).toISOString();

/* ── Jobs ─────────────────────────────────────────────────────────────────── */
export const DEMO_JOBS = [
  {
    _id: 'demo-1',
    title: 'Software Development Engineer',
    company: 'Amazon',
    location: 'Hyderabad, India',
    status: 'interviewing',
    match_score: 82,
    matched_skills: ['Node.js', 'React', 'MongoDB', 'REST APIs', 'AWS'],
    gap_skills: ['Kotlin', 'DynamoDB'],
    jd_text: 'Amazon is looking for a talented SDE to join our growing team. You will design and build large-scale distributed systems and contribute to customer-facing products used by millions.',
    source: 'LinkedIn',
    applied_on: daysAgo(14),
    notes: 'Completed OA — 2/3 problems solved. Technical interview scheduled next week.',
    createdAt: daysAgo(16),
    updatedAt: daysAgo(14),
  },
  {
    _id: 'demo-2',
    title: 'Frontend Engineer',
    company: 'Google',
    location: 'Bangalore, India',
    status: 'applied',
    match_score: 76,
    matched_skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Vite'],
    gap_skills: ['Angular', 'Web Components', 'Lit'],
    jd_text: 'Join Google as a Frontend Engineer and help build the next generation of web apps used by billions of people worldwide.',
    source: 'Company Website',
    applied_on: daysAgo(10),
    notes: 'Applied via alumni referral. Waiting for recruiter reply.',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(10),
  },
  {
    _id: 'demo-3',
    title: 'Full Stack Developer Intern',
    company: 'Microsoft',
    location: 'Noida, India',
    status: 'offered',
    match_score: 91,
    matched_skills: ['React', 'Node.js', 'Azure', 'TypeScript', 'SQL', 'REST APIs'],
    gap_skills: ['C#', '.NET Core'],
    jd_text: 'Microsoft is offering a 6-month internship for exceptional engineering students passionate about cloud and productivity software.',
    source: 'Campus Drive',
    applied_on: daysAgo(56),
    notes: '🎉 Offer received! Stipend: ₹45,000/month. Start: July 2026.',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(5),
  },
  {
    _id: 'demo-4',
    title: 'Backend Developer',
    company: 'Flipkart',
    location: 'Bangalore, India',
    status: 'saved',
    match_score: null,
    matched_skills: [],
    gap_skills: [],
    jd_text: 'Flipkart is hiring backend engineers to scale its e-commerce infrastructure handling millions of transactions daily.',
    source: 'LinkedIn',
    applied_on: null,
    notes: 'Interesting role — need to tailor resume before applying.',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    _id: 'demo-5',
    title: 'React Developer',
    company: 'Razorpay',
    location: 'Remote',
    status: 'saved',
    match_score: null,
    matched_skills: [],
    gap_skills: [],
    jd_text: 'Razorpay is looking for a React Developer to join our frontend infrastructure team working on next-gen payment UIs.',
    source: 'AngelList',
    applied_on: null,
    notes: '',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    _id: 'demo-6',
    title: 'DevOps Engineer',
    company: 'Atlassian',
    location: 'Pune, India',
    status: 'applied',
    match_score: 68,
    matched_skills: ['Docker', 'Git', 'Linux', 'CI/CD', 'GitHub Actions'],
    gap_skills: ['Kubernetes', 'Terraform', 'Helm', 'ArgoCD'],
    jd_text: 'Atlassian is hiring a DevOps Engineer to improve our build, release, and deployment infrastructure for Jira and Confluence.',
    source: 'LinkedIn',
    applied_on: daysAgo(7),
    notes: 'Applied via referral. Weak on K8s — need to study before interview.',
    createdAt: daysAgo(9),
    updatedAt: daysAgo(7),
  },
  {
    _id: 'demo-7',
    title: 'Software Engineer',
    company: 'Zomato',
    location: 'Gurgaon, India',
    status: 'applied',
    match_score: 74,
    matched_skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
    gap_skills: ['Go', 'Kafka', 'Celery'],
    jd_text: 'Zomato is hiring software engineers to work on core platform and logistics systems that power food delivery for 10M+ users.',
    source: 'LinkedIn',
    applied_on: daysAgo(5),
    notes: '',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(5),
  },
  {
    _id: 'demo-8',
    title: 'Systems Engineer',
    company: 'Infosys',
    location: 'Mysore, India',
    status: 'rejected',
    match_score: 55,
    matched_skills: ['Java', 'SQL', 'OOP'],
    gap_skills: ['Spring Boot', 'Microservices', 'Cloud Platforms'],
    jd_text: 'Infosys Systems Engineer campus recruitment for the 2026 batch across all engineering disciplines.',
    source: 'Campus Drive',
    applied_on: daysAgo(51),
    notes: 'Did not clear technical round. Spring Boot knowledge needs improvement.',
    createdAt: daysAgo(53),
    updatedAt: daysAgo(30),
  },
];

/* ── Pipeline Stats ───────────────────────────────────────────────────────── */
export const DEMO_STATS = {
  total: 8,
  saved: 2,
  applied: 3,
  interviewing: 1,
  offered: 1,
  rejected: 1,
};

/* ── TnP Opportunities ────────────────────────────────────────────────────── */
export const DEMO_TNP_OPPORTUNITIES = [
  {
    _id: 'demo-tnp-1',
    company: 'TCS',
    role: 'Software Engineer',
    location: 'Pan India',
    ctc: '7 LPA',
    eligibility: '60%+ throughout, No active backlogs, B.Tech CS/IT/ENTC',
    deadline: daysFromNow(2),
    skills_required: ['Java', 'DSA', 'SQL', 'OOPS', 'Problem Solving'],
    summary: 'TCS is conducting a campus recruitment drive for the 2026 batch. Role involves software development across banking, retail, and healthcare domains. Training provided at Mysore campus.',
    email_subject: 'TCS NQT Campus Drive 2026 — IT/CS/ENTC Students',
    email_body: 'Dear Students,\n\nTCS is pleased to announce its National Qualifier Test recruitment drive for the 2026 batch.\n\nPackage: 7 LPA\nEligibility: 60%+ throughout\nLast Date: as mentioned\n\nPlease register via the link below.\n\nBest regards,\nT&P Cell',
    email_from: 'tnp@pccoepune.org',
    status: 'interested',
    job_id: null,
    notes: 'Strong DSA prep needed. Practising 2–3 coding problems daily.',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    _id: 'demo-tnp-2',
    company: 'Wipro',
    role: 'Project Engineer',
    location: 'Bangalore / Hyderabad / Chennai',
    ctc: '6.5 LPA',
    eligibility: '60%+ throughout, B.Tech CS/IT/ENTC',
    deadline: daysFromNow(4),
    skills_required: ['Python', 'SQL', 'Communication', 'Logical Reasoning'],
    summary: 'Wipro Elite NLTH recruitment drive for top engineering colleges. Three-stage process: Online Assessment → Technical Interview → HR. Three months of training before project allocation.',
    email_subject: 'Wipro Elite NLTH — Registration Open for 2026 Batch',
    email_body: 'Dear Candidate,\n\nWe are pleased to inform you that Wipro will be visiting your campus for the Elite NLTH drive.\n\nPackage: 6.5 LPA\nProcess: OA → Technical → HR\n\nBest regards,\nT&P Cell',
    email_from: 'tnp@pccoepune.org',
    status: 'new',
    job_id: null,
    notes: '',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'demo-tnp-3',
    company: 'Capgemini',
    role: 'Analyst Trainee',
    location: 'Mumbai / Pune / Hyderabad',
    ctc: '5.5 LPA',
    eligibility: '55%+ throughout, No backlogs at time of joining',
    deadline: daysFromNow(1),
    skills_required: ['Aptitude', 'Logical Reasoning', 'English Proficiency'],
    summary: 'Capgemini SNAP Program for fresh graduates. Focus on digital transformation and technology consulting. No prior coding experience required — training provided on the job.',
    email_subject: '⚠ URGENT: Capgemini SNAP — Last Date Tomorrow',
    email_body: 'URGENT: The application window closes TOMORROW.\n\nPackage: 5.5 LPA\nRole: Analyst Trainee\nLocations: Mumbai, Pune, Hyderabad\n\nApply immediately!',
    email_from: 'tnp@pccoepune.org',
    status: 'new',
    job_id: null,
    notes: 'URGENT — deadline is tomorrow!',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

/* ── TnP Stats ────────────────────────────────────────────────────────────── */
export const DEMO_TNP_STATS = {
  total: 3,
  new: 2,
  interested: 1,
  applied: 0,
  ignored: 0,
  deadlineSoon: 3,
};

/* ── Resumes ──────────────────────────────────────────────────────────────── */
export const DEMO_RESUMES = [
  {
    _id: 'demo-resume-1',
    tag: 'full-stack',
    text: `Demo User
Full Stack Developer · demo@example.com · +91 98765 43210 · github.com/demo

TECHNICAL SKILLS
Frontend:  React, TypeScript, Vite, HTML5, CSS3, Tailwind CSS, Redux
Backend:   Node.js, Express.js, Spring Boot, REST APIs
Database:  MongoDB, MySQL, PostgreSQL, Redis
DevOps:    Docker, Git, GitHub Actions, Linux
AI/ML:     Google Gemini API, Python, XGBoost
Tools:     Postman, n8n, Figma, VS Code

PROJECTS
AI Job Tracker (2026)
Full-stack job tracker with Gemini AI parsing, n8n automation, multi-resume scoring.
Node.js · Express · MongoDB · React · Vite · n8n · Google Gemini

GitLens — Blue-Bit 4.0 Hackathon (2026)
Git analytics dashboard with AI-powered commit insights and graph visualisations.
Spring Boot · React · TypeScript · D3.js · ECharts · Cytoscape.js

WindWise (2026)
Wind energy prediction app. XGBoost model with R²=0.972 accuracy.
Python · Flask · React · XGBoost · Scikit-learn

EDUCATION
B.Tech Information Technology | CGPA: 8.4
Engineering College, Pune | 2022–2026`,
    wordCount: 165,
    charCount: 920,
    updatedAt: daysAgo(10),
  },
  {
    _id: 'demo-resume-2',
    tag: 'java_backend',
    text: `Demo User
Java Backend Developer · demo@example.com · +91 98765 43210

TECHNICAL SKILLS
Core:      Java, Spring Boot, Spring MVC, Spring Security, JPA/Hibernate
APIs:      REST, JWT Authentication, OAuth2, RBAC
Database:  MySQL, PostgreSQL, MongoDB
Testing:   JUnit 5, Mockito, Integration Testing
Tools:     Maven, Docker, Git, Postman, IntelliJ IDEA

PROJECTS
GitLens Backend (2026)
Spring Boot REST API with JGit integration for real-time Git repository analytics.
Spring Boot · MySQL · Gemini API · JGit

Spring Boot API Suite (2026)
Comprehensive REST APIs with Spring Security, JWT, BCrypt, and RBAC.
Spring Boot · Spring Security · MySQL · JUnit · Mockito

EDUCATION
B.Tech Information Technology | CGPA: 8.4
Engineering College, Pune | 2022–2026`,
    wordCount: 110,
    charCount: 680,
    updatedAt: daysAgo(15),
  },
];
