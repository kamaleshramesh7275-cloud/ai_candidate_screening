# AI Candidate Screening — Full Project Prompt

> This document contains the complete source code and architecture of the **ZingoRecruit / AI Candidate Screening** project built for the **Redrob Intelligent Candidate Discovery & Ranking Hackathon**.
> Use this as full context when prompting an LLM to extend, debug, or add features.

---

## 📁 Project Structure

```
ai_candidate_screening/
├── rank.py                        # Python hackathon ranker (100K candidates → top 100)
├── inspect_submission.py          # Validates submission.csv
├── submission.csv                 # Generated hackathon output
├── submission_metadata.yaml       # Hackathon submission metadata
├── requirements.txt               # Python deps (none—pure stdlib)
├── docker-compose.yml
├── render.yaml                    # Render.com deployment config
│
├── backend/                       # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── index.ts               # App entry + all routes
│   │   ├── questions.json         # MCQ question bank (~24 KB)
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── intake.controller.ts
│   │   │   ├── recruiter.controller.ts
│   │   │   └── test.controller.ts
│   │   └── services/
│   │       ├── github.service.ts
│   │       ├── linkedin.service.ts
│   │       ├── resume.service.ts
│   │       ├── scoring.service.ts
│   │       └── verification.service.ts
│   └── prisma/
│       └── schema.prisma          # PostgreSQL schema (SQLite in dev)
│
└── frontend/                      # Next.js 15, React 19, Tailwind v4, Shadcn UI
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── globals.css
        │   ├── page.tsx           # Landing page (ZingoRecruit)
        │   ├── login/page.tsx
        │   ├── candidate-dashboard/page.tsx   # Intake + test + success flow
        │   ├── recruiter-dashboard/page.tsx   # Analytics + candidate table
        │   └── success/page.tsx
        ├── components/
        │   ├── CandidateDialog.tsx
        │   ├── ThemeProvider.tsx
        │   └── ThemeToggle.tsx
        └── lib/
            ├── api.ts             # API_BASE = "" (same-origin)
            └── utils.ts
```

---

## 🏆 Hackathon Context (submission_metadata.yaml)

```yaml
team_name: "ai-candidate-screening"
primary_contact:
  name: "Kamalesh Ramesh"
  email: "kamaleshramesh7275@gmail.com"
  role: "Team Lead / ML Engineer"

github_repo: "https://github.com/kamaleshramesh7275/ai_candidate_screening"
sandbox_link: "https://huggingface.co/spaces/kamaleshramesh7275/redrob-ranker"
reproduce_command: "python rank.py --candidates ./candidates.jsonl --out ./submission.csv"

compute:
  platform: "Windows PC"
  cpu_cores: 8
  ram_gb: 16
  python_version: "3.14"
  uses_gpu_for_inference: false
  has_network_during_ranking: false

ai_tools_used: ["Gemini"]

methodology_summary: |
  Rule-based multi-signal ranker with 5 weighted components:
  (1) Skills match 30% — must-have retrieval/embedding/vector-DB keywords
  (2) Career evidence 35% — keyword hits, product-company fraction, title alignment
  (3) Experience years 15% — 5-9yr target, peaks at 6-8yr
  (4) Location 10% — Noida/Pune preferred
  (5) Behavioral signals 10% — recency, open-to-work, GitHub score
  Honeypot detection filters ~127 candidates with impossible job durations.
  Runtime: ~3 seconds for 100K candidates. Zero external API calls.
```

---

## 🐍 Hackathon Ranker — rank.py (key sections)

```python
#!/usr/bin/env python3
"""
rank.py — Redrob Intelligent Candidate Ranking Challenge
Usage:
    python rank.py --candidates ./candidates.jsonl --out ./submission.csv
Produces exactly 100 rows (rank 1–100): candidate_id, rank, score, reasoning
"""

REFERENCE_DATE = date(2026, 6, 23)

# Consulting companies = 0.5x penalty if entire career there
CONSULTING_COMPANIES = {
    "tcs", "infosys", "wipro", "accenture", "cognizant", "capgemini",
    "hcl", "mphasis", "hexaware", "mindtree", "tech mahindra",
    "l&t infotech", "ltimindtree", "syntel", "igate",
}

MUST_HAVE_SKILLS = {
    "sentence-transformers", "openai embeddings", "bge", "e5", "embeddings",
    "dense retrieval", "semantic search", "embedding", "vector embeddings",
    "pinecone", "weaviate", "qdrant", "milvus", "faiss", "opensearch",
    "elasticsearch", "chroma", "vespa", "pgvector",
    "information retrieval", "learning to rank", "ltr", "ndcg", "mrr",
    "bm25", "hybrid search", "hybrid retrieval", "ranking", "retrieval",
    "reranking", "re-ranking",
    "nlp", "natural language processing", "transformers", "bert",
    "rag", "retrieval augmented generation",
    "python",
}

NICE_SKILLS = {
    "lora", "qlora", "peft", "fine-tuning", "finetuning",
    "xgboost", "lightgbm", "recommendation system", "collaborative filtering",
    "distributed systems", "kafka", "spark",
    "pytorch", "tensorflow", "huggingface",
    "a/b testing", "ab testing", "experimentation",
}

HIGH_VALUE_CAREER_KEYWORDS = [
    "recommendation", "recommender", "search", "retrieval", "ranking",
    "embedding", "vector", "rag", "semantic", "information retrieval",
    "nlp", "natural language", "language model", "llm", "bert", "transformer",
    "learning to rank", "dense retrieval", "sparse retrieval", "hybrid search",
    "candidate matching", "job matching", "talent intelligence",
    "personalization", "content-based filtering", "collaborative filtering",
    "a/b test", "experiment", "ndcg", "mrr", "precision@", "recall@",
    "offline evaluation", "online evaluation",
    "shipped", "deployed", "production", "scaled", "scale",
]

# Score weights
WEIGHTS = {
    "skills":   0.30,  # Must-have + nice-to-have keyword match
    "career":   0.35,  # Applied ML/AI keywords in JDs, product-company fraction, title fit
    "exp_yoe":  0.15,  # 5-9 year target band; peaks at 6-8 years
    "location": 0.10,  # Noida/Pune preferred, graded by proximity
    "behavioral": 0.10 # Recency, open-to-work, response rate, notice period, GitHub
}

# Hard penalties
# Entirely consulting background → 0.5× score
# Non-tech title (Marketing Manager, etc.) → 0.25× score

# Honeypot detection filters candidates with:
# - Calculated vs stated duration_months > 4 months difference
# - Expert skills with 0 duration
# - YOE vs career span mismatches
```

---

## 🔧 Backend — Node.js + Express + TypeScript

### `backend/src/index.ts` — App Entry & Routes

```typescript
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { handleIntake } from './controllers/intake.controller';
import { recruiterLogin } from './controllers/auth.controller';
import { generateTest, submitTest } from './controllers/test.controller';
import { getCandidates, updateCandidateStatus, updateCandidateNotes } from './controllers/recruiter.controller';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// JWT middleware for recruiter routes
const authenticateRecruiter = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied.' });
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'supersecretrecruiterjwttokenkey');
    next();
  } catch { res.status(403).json({ message: 'Invalid token.' }); }
};

// Public routes
app.post('/api/candidates/intake', upload.single('resume'), handleIntake);
app.get('/api/test/generate/:domain', generateTest);
app.post('/api/test/submit', submitTest);
app.post('/api/recruiter/login', recruiterLogin);

// Protected recruiter routes
app.get('/api/recruiter/candidates', authenticateRecruiter, getCandidates);
app.patch('/api/recruiter/candidates/:id/status', authenticateRecruiter, updateCandidateStatus);
app.patch('/api/recruiter/candidates/:id/notes', authenticateRecruiter, updateCandidateNotes);

// Serve Next.js static export in production
app.use(express.static(path.join(__dirname, '../../frontend/out')));
app.use((req, res) => res.sendFile(path.join(__dirname, '../../frontend/out/index.html')));

app.listen(port);
export { prisma };
```

### `backend/prisma/schema.prisma` — Database Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Candidate {
  id              String   @id @default(uuid())
  name            String
  email           String   @unique
  linkedInUrl     String?
  githubUrl       String?
  resumeText      String?
  domain          String?

  // Phase 1 Scores & Verification
  resumeScore     Float?
  githubScore     Float?
  linkedInScore   Float?
  skillsMatchLog  String?  // JSON: { matched: [], missing: [], matchPercentage: number }
  githubRawData   String?  // JSON: { public_repos, stars, languages, recentCommitsScore, monthlyActivity }
  linkedInRawData String?  // JSON: { data: { headline, summary } }

  // Phase 2 Test Data
  testCompleted   Boolean  @default(false)
  testScore       Float?
  testStartTime   DateTime?
  cheatStrikes    Int      @default(0)
  cheatLog        String?  // JSON array: [{ type, timestamp }]

  // Recruiter
  recruiterNotes  String?
  overallScore    Float?
  status          String   @default("Applied") // Applied | Tested | Shortlisted | Rejected

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Recruiter {
  id        String @id @default(uuid())
  email     String @unique
  password  String // Hashed
  name      String
}
```

### `backend/src/controllers/intake.controller.ts`

```typescript
export const handleIntake = async (req, res) => {
  const { name, email, linkedInUrl, githubUrl, domain } = req.body;
  const resumeBuffer = req.file?.buffer;

  // 1. Parse resume PDF → extract text
  const resumeText = resumeBuffer ? await parseResume(resumeBuffer) : '';

  // 2. Fetch GitHub API data (public repos, stars, languages, monthly push activity)
  const githubData = githubUrl ? await fetchGitHubData(githubUrl) : null;

  // 3. Scrape LinkedIn (stubbed — LinkedIn blocks Puppeteer without proxies)
  const linkedInData = linkedInUrl ? await scrapeLinkedIn(linkedInUrl) : null;

  // 4. Cross-verify: resume text vs GitHub languages
  const skillsMatchLog = (resumeText && githubData?.languages)
    ? verifySkills(resumeText, Object.keys(githubData.languages))
    : {};

  // 5. Score each signal
  const resumeScore  = calculateResumeScore(resumeText, domain);   // keyword match
  const githubScore  = githubData ? calculateGithubScore(githubData) : 0;
  const linkedInScore = calculateLinkedInScore(linkedInUrl, linkedInData);

  // 6. Persist to DB
  const candidate = await prisma.candidate.create({
    data: { name, email, linkedInUrl, githubUrl, resumeText, domain,
            resumeScore, githubScore, linkedInScore,
            skillsMatchLog: JSON.stringify(skillsMatchLog),
            githubRawData: githubData ? JSON.stringify(githubData) : null,
            linkedInRawData: linkedInData ? JSON.stringify(linkedInData) : null }
  });

  res.status(201).json({ candidateId: candidate.id, scores: { resume: resumeScore, github: githubScore, linkedin: linkedInScore } });
};
```

### `backend/src/controllers/test.controller.ts`

```typescript
// generateTest — serves domain-specific MCQ questions (no answers exposed)
export const generateTest = async (req, res) => {
  const domain = req.params.domain;
  const allQuestions = questionsDb[domain] || questionsDb['General CS'];
  const testQuestions = allQuestions
    .map(q => ({ id: q.id, question: q.question, options: q.options }))
    .sort(() => Math.random() - 0.5);  // Randomize order
  res.json({ questions: testQuestions });
};

// submitTest — server-side scoring with anti-cheat validation
export const submitTest = async (req, res) => {
  const { candidateId, answers, cheatStrikes, cheatLog } = req.body;

  // Server-side time validation
  // Max allowed = (numQuestions * 60s) + 60s buffer
  // Excess time → +2 cheat strikes

  // Score: (correct / total) * 100 − (strikes * 5), floor at 0
  const testScore = Math.max(
    (correctCount / allQuestions.length) * 100 - (finalCheatStrikes * 5),
    0
  );

  // Overall = Resume 25% + GitHub 25% + Test 50%
  const overallScore = (resumeScore * 0.25) + (githubScore * 0.25) + (testScore * 0.50);

  await prisma.candidate.update({
    where: { id: candidateId },
    data: { testCompleted: true, testScore, cheatStrikes, cheatLog, overallScore, status: 'Tested' }
  });
};
```

### `backend/src/services/scoring.service.ts`

```typescript
// Resume score: keyword match against domain-specific keyword set (0–100)
export const calculateResumeScore = (resumeText, domain) => {
  const domainKeywords = {
    Frontend: ['react', 'next.js', 'javascript', 'typescript', 'css', 'html', 'tailwind', 'redux', 'vue', 'angular'],
    Backend:  ['node.js', 'express', 'python', 'django', 'java', 'spring', 'sql', 'postgresql', 'mongodb', 'docker', 'api'],
    DevOps:   ['aws', 'kubernetes', 'docker', 'ci/cd', 'jenkins', 'terraform', 'linux', 'bash'],
    ML:       ['python', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'machine learning', 'deep learning'],
    'General CS': ['data structures', 'algorithms', 'git', 'agile', 'oop', 'c++']
  };
  const targets = domainKeywords[domain] || Object.values(domainKeywords).flat();
  const matchCount = targets.filter(kw => resumeText.toLowerCase().includes(kw)).length;
  return Math.min((matchCount / 10) * 100, 100);
};

// GitHub score: (repos * 2) + (unique_langs * 3) + (recentCommits * 2) + (stars * 1), cap 100
export const calculateGithubScore = ({ public_repos, languages, recentCommitsScore, stars }) => {
  return Math.min(
    (public_repos * 2) + (Object.keys(languages).length * 3) + (recentCommitsScore * 2) + (stars * 1),
    100
  );
};

// Overall weighted score
export const calculateOverallScore = (resumeScore, githubScore, testScore) =>
  (resumeScore * 0.25) + (githubScore * 0.25) + (testScore * 0.50);
```

### `backend/src/services/github.service.ts`

```typescript
export const fetchGitHubData = async (githubUrl) => {
  const username = githubUrl.match(/github\.com\/([^\/]+)/)?.[1];
  if (!username) return null;

  const userData = await fetch(`https://api.github.com/users/${username}`).then(r => r.json());
  const reposData = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`).then(r => r.json());

  let stars = 0;
  const languages = {};
  let recentCommitsScore = 0;
  const monthlyActivity = {}; // Last 12 months keyed "YYYY-MM"

  for (const repo of reposData) {
    stars += repo.stargazers_count || 0;
    if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
    if (new Date(repo.pushed_at) > thirtyDaysAgo) recentCommitsScore++;
    monthlyActivity[monthKey]++; // track push activity per month
  }

  return { public_repos: userData.public_repos, stars, languages, recentCommitsScore, monthlyActivity };
};
```

### `backend/src/services/verification.service.ts`

```typescript
// Cross-check resume text against GitHub language list
export const verifySkills = (resumeText, githubLanguages) => {
  const matched = githubLanguages.filter(lang =>
    new RegExp(`\\b${lang}\\b`, 'i').test(resumeText)
  );
  const missing = githubLanguages.filter(lang => !matched.includes(lang));
  return { matched, missing, matchPercentage: (matched.length / githubLanguages.length) * 100 };
};
```

### `backend/src/controllers/auth.controller.ts`

```typescript
// Recruiter login — password from env var, returns JWT
export const recruiterLogin = async (req, res) => {
  const { password } = req.body;
  if (password === (process.env.RECRUITER_PASSWORD || 'admin')) {
    const token = jwt.sign({ role: 'recruiter' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
};
// NOTE: Candidate auth uses email/password stored in DB (bcrypt hashed)
// Register: POST /api/auth/candidate/register
// Login:    POST /api/auth/candidate/login
```

### Backend Dependencies (`backend/package.json`)

```json
{
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "bcrypt": "^6.0.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "multer": "^2.1.1",
    "pdf-parse": "^2.4.5",
    "puppeteer": "^25.1.0",
    "prisma": "^5.22.0",
    "ts-node": "^10.9.2",
    "typescript": "^6.0.3"
  }
}
```

---

## 🖥️ Frontend — Next.js 15, React 19, Tailwind v4, Shadcn UI

### Stack

- **Framework**: Next.js 15 App Router
- **UI Library**: Shadcn UI components (Card, Button, Input, Label, Select, Table, Badge, Accordion)
- **Styling**: Tailwind CSS v4 + custom CSS variables (oklch colors, dark mode)
- **Icons**: Lucide React
- **State**: React `useState` / `useEffect` / `useCallback`
- **Auth**: `localStorage` session (JSON `{ id, name, email, role }`)
- **API**: `fetch()` against `API_BASE = ""` (same-origin in production)

### `frontend/src/lib/api.ts`

```typescript
// Same-origin — backend serves frontend static export in production
export const API_BASE = "";
```

### `frontend/src/app/layout.tsx`

```tsx
// Inter font, dark mode forced via ThemeProvider
// ThemeProvider wraps all children with attribute="class" defaultTheme="dark"
```

### Page Inventory

| Route | File | Description |
|-------|------|-------------|
| `/` | `page.tsx` | Landing page (ZingoRecruit branding, dark gradient, features) |
| `/login` | `login/page.tsx` | Split panel: hero left + form right. Candidate/Recruiter tabs. Register/Login toggle. Google SSO (mock). |
| `/candidate-dashboard` | `candidate-dashboard/page.tsx` | 4-view flow: Intake → Review → Test → Success |
| `/recruiter-dashboard` | `recruiter-dashboard/page.tsx` | Analytics (donut chart, domain bars, pass rate) + candidate table + accordion detail view |
| `/success` | `success/page.tsx` | Simple success confirmation page |

---

### `frontend/src/app/candidate-dashboard/page.tsx` — 4-View Flow

```
viewState: 'intake' | 'review' | 'test' | 'success'
```

**VIEW 1 — Intake Form**
- Domain selector (Frontend / Backend / DevOps / ML / General CS)
- LinkedIn URL input
- GitHub URL input
- Resume PDF upload (drag & drop, max 5MB)
- On submit → POST `/api/candidates/intake` (multipart/form-data)

**VIEW 2 — Score Review**
- Shows Resume Score, GitHub Score, LinkedIn Score (0–100 each, with progress bars)
- "Start Assessment" button → VIEW 3

**VIEW 3 — Proctored MCQ Test (AssessmentFlow component)**

Anti-cheat monitors (fires on `started = true`):
```typescript
document.addEventListener('visibilitychange', ...)  // Tab switch
window.addEventListener('blur', ...)                // Window blur
document.addEventListener('contextmenu', ...)       // Right-click
document.addEventListener('copy', ...)              // Copy
document.addEventListener('paste', ...)             // Paste
document.addEventListener('mouseleave', ...)        // Mouse leaves window
document.addEventListener('fullscreenchange', ...)  // Exit fullscreen
setInterval(checkDevTools, 2000)                    // DevTools size check

// 3 strikes → auto-submit with penalty
// Each strike: cheatLog.push({ type, timestamp })
// Score penalty: strikes * 5 points
```

Test mechanics:
- Fetches questions from `GET /api/test/generate/:domain`
- 60 seconds per question (countdown timer, turns red at ≤10s)
- Auto-advance on timeout
- Progress bar (currentQ / total)
- Submit → POST `/api/test/submit`

**VIEW 4 — Success**
- Shows testScore% and overall status badge (Shortlisted / Tested / Rejected)

---

### `frontend/src/app/recruiter-dashboard/page.tsx` — Recruiter Panel

**Auth**: Reads `localStorage.user_session`, requires `role === 'recruiter'`

**Stats Row**: Total Applicants | Shortlisted count | Avg Overall Score

**Analytics Grid (3 panels)**:
1. **Status Distribution** — SVG donut chart (Applied/Tested/Shortlisted/Rejected)
2. **Domains Applied** — horizontal bar chart per domain
3. **Assessment Pass Rate** — pass rate ≥70%, avg test score, total proctoring alerts

**Candidate Table**:
- Columns: Name/Email | Domain badge | Overall Score + mini progress bar | Status badge | Shortlist/Reject buttons
- Search filter by name or domain
- CSV export button

**Detailed Breakdown Accordions** (per candidate):
- Mini score grid: Resume / GitHub / Test / Cheat Strikes
- Security Log: terminal-style dark panel with cheat event timeline
- Skill Verification Matrix: GitHub-verified (green) vs Missing from Resume (grey) language badges
- GitHub Profile: repos, stars, commits stats + 12-month commit activity heatmap
- LinkedIn Profile: headline + summary (stubbed placeholder data)
- Resume Viewer: full text with domain keywords highlighted in amber

---

### Landing Page (`page.tsx`) — Design Tokens

```css
/* Background */
background: radial-gradient(circle at 15% 50%, rgba(103,31,163,0.4), transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(31,75,163,0.3),  transparent 50%),
            #090a0f;

/* Brand Colors */
--pink: #ff2a75   (primary CTA, hover glow)
--blue: #2a5bff   (secondary CTA)
--dark-bg: #090a0f
--card-bg: rgba(21, 23, 37, 0.6)  (glassmorphism)
--text-muted: #a0a5b5

/* Animations */
fadeUp: opacity 0 → 1, translateY(30px → 0), 0.7s cubic-bezier(0.16, 1, 0.3, 1)
```

**Sections**: Navbar (sticky glassmorphism) → Hero (text + mock dashboard preview + countdown blocks) → About (stats: 40+ domains, 2.5K+ candidates, 36+ companies, 30+ sponsors) → Features (3 cards: Data-Driven Verification, Strict Anti-Cheat, Instant Scoring) → Footer

---

## 🔑 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Rule-based scorer (no LLM) | Deterministic, explainable, zero API cost, 3s for 100K candidates |
| GitHub API (public, no auth) | Verifiable signal; rate limits apply at scale |
| LinkedIn scraping stubbed | LinkedIn aggressively blocks Puppeteer without residential proxies |
| SQLite in dev, PostgreSQL in prod | Prisma ORM makes the swap trivial |
| Test score penalty per cheat strike | Deters cheating without hard-failing minor incidents |
| Server-side time validation | Prevents candidates from pausing and resuming the timer client-side |
| Same-origin deployment | Backend serves Next.js `/out` static export — single process, no CORS in prod |
| JWT for recruiter, localStorage for candidate | Recruiter routes are API-protected; candidate state is lightweight |

---

## 🚀 Scoring Formula Summary

```
overallScore = (resumeScore × 0.25) + (githubScore × 0.25) + (testScore × 0.50)

resumeScore  = min((keywordMatches / 10) × 100, 100)
githubScore  = min((repos × 2) + (langs × 3) + (recentCommits × 2) + (stars × 1), 100)
testScore    = max(((correct / total) × 100) − (cheatStrikes × 5), 0)

hackathonScore = (skillsSignal × 0.30) + (careerSignal × 0.35) +
                 (yoeSignal × 0.15) + (locationSignal × 0.10) + (behavioralSignal × 0.10)
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/candidate/register` | None | Register candidate |
| POST | `/api/auth/candidate/login` | None | Login candidate |
| POST | `/api/recruiter/login` | None | Recruiter password login → JWT |
| POST | `/api/candidates/intake` | None | Submit resume + links, get initial scores |
| GET | `/api/candidate/profile/:id` | None | Fetch candidate profile |
| GET | `/api/test/generate/:domain` | None | Get randomized MCQ questions |
| POST | `/api/test/submit` | None | Submit answers, get scored |
| GET | `/api/recruiter/candidates` | JWT | All candidates ordered by score desc |
| PATCH | `/api/recruiter/candidates/:id/status` | JWT | Update status (Shortlisted/Rejected) |
| PATCH | `/api/recruiter/candidates/:id/notes` | JWT | Save recruiter notes |

---

## 🏃 Running Locally

```bash
# Python ranker (hackathon submission)
python rank.py --candidates ./candidates.jsonl --out ./submission.csv

# Backend (http://localhost:3001)
cd backend
npm install
npx prisma db push
npm run dev

# Frontend (http://localhost:3000)
cd frontend
npm install
npm run dev
```

Environment variables (`backend/.env`):
```
DATABASE_URL="file:./prisma/dev.db"   # SQLite in dev
JWT_SECRET="your-secret"
RECRUITER_PASSWORD="admin"
GITHUB_TOKEN=""                        # Optional, raises API rate limit
```
