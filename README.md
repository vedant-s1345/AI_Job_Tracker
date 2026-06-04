<div align="center">

# ⬡ AI Job Tracker

### *Intelligent job application tracking — powered by Gemini AI & n8n automation*

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![n8n](https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

<br/>

> **Stop manually tracking job applications in spreadsheets.**  
> AI Job Tracker automatically parses job descriptions, scores your resume against each role,  
> monitors your college's T&P emails, and reminds you before deadlines expire — all autonomously.

<br/>

![License](https://img.shields.io/badge/license-MIT-00c9a7?style=flat-square)
![Status](https://img.shields.io/badge/status-active-00c9a7?style=flat-square)
![Backend](https://img.shields.io/badge/backend-port%205000-6366f1?style=flat-square)
![Frontend](https://img.shields.io/badge/frontend-port%205173-a855f7?style=flat-square)
![n8n](https://img.shields.io/badge/n8n-port%205678-EA4B71?style=flat-square)

</div>

---

## 📸 Screenshots

> *Dashboard · Pipeline Board · Analytics · T&P Monitor · Resume Manager*

| Dashboard | Pipeline (Kanban) |
|---|---|
| ![Dashboard] <img width="1917" height="905" alt="image" src="https://github.com/user-attachments/assets/931b1354-c6fb-479b-a625-bce576291d98" />
 | ![Pipeline] <img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/62c453a0-21e6-4858-a21a-52ba7e2c62a3" />
 |

| Analytics | T&P Monitor |
|---|---|
| ![Analytics] <img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/58e50810-6d0a-4bc0-b18f-75ef759cd329" />
 | ![TnP] <img width="1918" height="897" alt="image" src="https://github.com/user-attachments/assets/c23c5f32-f2e3-4c17-ae3c-065f4289cdc6" />
 |

---

## ✨ Features

### 🤖 AI-Powered
- **JD Parser** — paste or upload a PDF job description → Gemini AI extracts company, role, skills, and requirements instantly
- **Resume Scorer** — AI scores your resume against any job (0–100), highlights matched skills and skill gaps
- **Multi-Resume Support** — maintain separate resumes by profile tag (`full-stack`, `java_backend`, `aiml`, `frontend`, `devops`)
- **Smart Matching** — pick which resume to score against which job from a dropdown

### 📋 Application Pipeline
- **Kanban Board** — drag-friendly pipeline with stages: `Saved → Applied → Interviewing → Offered → Rejected`
- **Pipeline Health Bars** — sidebar shows real-time health visualization of your application funnel
- **Status Tracking** — one-click status updates across all jobs
- **Rich Notes** — add notes, follow-up dates, and interview prep per job

### 🎓 T&P (Training & Placement) Monitor
- **Auto-ingestion** — n8n watches your Gmail for T&P emails, parses them via Gemini, saves to DB automatically
- **Deadline Urgency Colors** — red (today/tomorrow), yellow (≤3 days), green (≤5 days)
- **One-Click Pipeline Add** — push any T&P opportunity directly into your job pipeline
- **Status Filters** — filter by `new`, `interested`, `applied`, `ignored`

### ⏰ Automation (n8n Workflows)
- **Workflow 1** — HTTP webhook: parse any JD via Gemini → auto-save to DB
- **Workflow 2** — HTTP webhook: score resume against job → auto-update match score
- **Workflow 3** — Gmail Monitor: T&P email arrives → Gemini parses → saved as opportunity
- **Workflow 4** — Daily 9 AM reminder: email digest of deadlines in the next 5 days

### 🎨 Premium Dark UI
- **Terminal Intelligence** aesthetic — dark, minimal, data-dense
- **Fonts**: Syne (headings) · IBM Plex Mono (data) · Barlow (body)
- **Accent**: `#00c9a7` teal throughout
- Fully responsive with smooth transitions

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│   React + Vite (port 5173)                                  │
│   Dashboard · Pipeline · Analytics · Resume · T&P · Settings│
└───────────────────────┬─────────────────────────────────────┘
                        │ axios (REST API calls)
┌───────────────────────▼─────────────────────────────────────┐
│                        BACKEND                              │
│   Node.js + Express (port 5000)                             │
│   /api/jobs · /api/tnp · /api/jobs/resume                   │
└──────────┬──────────────────────────┬───────────────────────┘
           │ Mongoose                 │ HTTP calls
┌──────────▼──────────┐   ┌──────────▼───────────────────────┐
│   MongoDB Atlas     │   │         n8n (port 5678)           │
│   jobs collection   │   │  Workflow 1: Parse JD via Gemini  │
│   resumes           │   │  Workflow 2: Score Resume         │
│   tnpopportunities  │   │  Workflow 3: Gmail TnP Monitor    │
└─────────────────────┘   │  Workflow 4: Daily Deadline Email │
                          └──────────────────────────────────┘
                                        │
                          ┌─────────────▼────────────────────┐
                          │      Google Gemini AI            │
                          │  JD parsing · Resume scoring     │
                          │  Email parsing · Summarization   │
                          └──────────────────────────────────┘
```

---

## 🗂 Project Structure

```
ai-job-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MongoDB Atlas connection
│   │   ├── models/
│   │   │   ├── Job.js                 # Job application schema
│   │   │   ├── Resume.js              # Multi-resume schema (tagged)
│   │   │   └── TnPOpportunity.js      # T&P email opportunity schema
│   │   ├── routes/
│   │   │   ├── Jobs.js                # /api/jobs — CRUD + stats + resume
│   │   │   └── tnp.js                 # /api/tnp — CRUD + stats + pipeline
│   │   └── index.js                   # Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js              # Axios instance + API helpers
    │   ├── components/
    │   │   ├── Sidebar.jsx            # Nav + pipeline health + resume badge
    │   │   ├── AddJobModal.jsx        # Add job + JD parse + PDF upload
    │   │   ├── JobDetailModal.jsx     # Full job details + resume scoring
    │   │   └── JobCard.jsx            # Kanban card component
    │   ├── pages/
    │   │   ├── DashboardPage.jsx      # Stats overview + recent jobs
    │   │   ├── PipelinePage.jsx       # Kanban board by status
    │   │   ├── AnalyticsPage.jsx      # Charts + score distributions
    │   │   ├── ResumePage.jsx         # Multi-resume manager
    │   │   ├── TnPPage.jsx            # T&P opportunities monitor
    │   │   └── SettingsPage.jsx       # App settings
    │   ├── App.jsx                    # Root + state-based routing
    │   ├── App.css                    # Global dark theme + CSS variables
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Docker Desktop (for n8n)
- MongoDB Atlas account (free tier works)
- Google AI Studio API key (Gemini)

### 1. Clone the repo

```bash
git clone https://github.com/vedant-s1345/AI_Job_Tracker.git
cd AI_Job_Tracker
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```

Start the backend:

```bash
npm start
# Running on http://localhost:5000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

### 4. n8n setup (Docker)

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
# Dashboard at http://localhost:5678
```

> **Windows users:** Create a `start-n8n.bat` on your Desktop with the above command for one-click startup.

### 5. Configure n8n Workflows

Import and configure 4 workflows in n8n:

| # | Workflow | Trigger | Description |
|---|---|---|---|
| 1 | Parse JD | HTTP Webhook | POST `/webhook/parse-job` → Gemini extracts JD → saves Job |
| 2 | Score Resume | HTTP Webhook | POST `/webhook/score-job` → Gemini scores → updates Job |
| 3 | TnP Monitor | Gmail Trigger | New T&P email → Gemini parses → saves TnPOpportunity |
| 4 | Daily Reminder | Schedule 9 AM | GET upcoming deadlines → HTML email digest → Gmail send |

---

## 📡 API Reference

### Jobs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | List all jobs (filter: status, company, minScore) |
| `POST` | `/api/jobs` | Create a job |
| `GET` | `/api/jobs/:id` | Get one job |
| `PATCH` | `/api/jobs/:id` | Update job (status, scores, notes) |
| `DELETE` | `/api/jobs/:id` | Delete a job |
| `GET` | `/api/jobs/stats/pipeline` | Pipeline stats `{saved, applied, interviewing, offered, rejected}` |
| `GET` | `/api/jobs/resume` | Get resume by tag |
| `GET` | `/api/jobs/resumes` | Get all resumes |
| `POST` | `/api/jobs/resume` | Upsert resume by tag |
| `POST` | `/api/jobs/extract-pdf` | Extract text from PDF JD |

### T&P Opportunities

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tnp` | List opportunities (filter: status, deadlineWithin, search) |
| `POST` | `/api/tnp` | Create opportunity (called by n8n) |
| `GET` | `/api/tnp/stats` | Stats `{total, new, interested, applied, ignored, deadlineSoon}` |
| `PATCH` | `/api/tnp/:id` | Update status/notes |
| `POST` | `/api/tnp/:id/add-to-pipeline` | Push opportunity to Job pipeline |
| `DELETE` | `/api/tnp/:id` | Delete opportunity |

---

## 🎨 Design System

```css
/* Color Palette */
--bg:       #070a12   /* Page background      */
--bg2:      #0d1120   /* Card background       */
--bg3:      #111827   /* Header background     */
--bg4:      #1a2236   /* Border/divider        */
--acc:      #00c9a7   /* Teal accent           */
--tx:       #e2e8f4   /* Primary text          */
--tx2:      #7b8ba5   /* Secondary text        */
--tx3:      #3a4d68   /* Muted text            */

/* Status Colors */
--saved:        #6366f1   /* Indigo   */
--applied:      #3b82f6   /* Blue     */
--interviewing: #a855f7   /* Purple   */
--offered:      #22c55e   /* Green    */
--rejected:     #ef4444   /* Red      */
```

---

## 🗺 Roadmap

- [x] Multi-page React frontend with state-based routing
- [x] Gemini AI JD parsing + resume scoring
- [x] Multi-resume support with profile tags
- [x] PDF JD upload + text extraction
- [x] T&P email monitor via n8n + Gmail
- [x] Daily deadline reminder email
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Deploy n8n to cloud (24/7 automation)
- [ ] Analytics charts (Recharts — score trends, pipeline flow)
- [ ] Flutter mobile app
- [ ] Interview prep AI assistant per job

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Custom CSS (no UI library) |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **AI** | Google Gemini 2.0 Flash via n8n |
| **Automation** | n8n (self-hosted via Docker) |
| **File Processing** | multer, pdf-parse |
| **Dev Tools** | Postman, VS Code, Docker Desktop |

---

## 👨‍💻 Author

**Vedant Sarode**  
T.Y. B.Tech Information Technology  
Pimpri Chinchwad College of Engineering (PCCoE), Pune

[![GitHub](https://img.shields.io/badge/GitHub-vedant--s1345-181717?style=flat-square&logo=github)](https://github.com/vedant-s1345)

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with 🤖 AI · ⚡ Automation · ☕ Chai**

*If this project helped you, consider giving it a ⭐*

</div>
