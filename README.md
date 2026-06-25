# AI Recruiter — Redrob Intelligent Candidate Ranking Challenge

This repository contains two components:

1. **Hackathon Ranker** — an AI candidate ranking system for the [Redrob Intelligent Candidate Discovery & Ranking Challenge](https://redrob.io).
2. **AI Recruiter Web App** — a full-stack technical interviewing and screening platform.

---

## 🏆 Hackathon: Intelligent Candidate Discovery & Ranking

### What it does

Ranks the top 100 candidates from a 100,000-candidate pool for a **Senior ML/AI Engineer — Search & Recommendation Systems** position.

### How to reproduce the submission

**Requirements:** Python 3.10+ — no external packages needed (pure standard library).

```bash
# Rank all 100,000 candidates and output submission.csv
python rank.py --candidates ./candidates.jsonl --out ./submission.csv

# Validate the output
python validate_submission.py submission.csv
```

Runtime: **~3–5 seconds** on CPU. Memory: **~1.5 GB peak**. No GPU, no network calls.

### Architecture

A rule-based, multi-signal scorer with five weighted components:

| Component | Weight | What it measures |
|---|---|---|
| **Skills match** | 30% | Must-have retrieval/embedding/vector-DB keywords, weighted by proficiency × duration trust |
| **Career evidence** | 35% | Applied ML/AI keywords in job descriptions, product-company fraction, title fit |
| **Experience years** | 15% | 5-9 year target band; peaks at 6-8 years |
| **Location** | 10% | Noida/Pune preferred; graded by city proximity to role |
| **Behavioral signals** | 10% | Recency, open-to-work, response rate, notice period, GitHub score |

**Honeypot detection**: ~127 candidates are filtered by checking impossible job durations (calculated vs stated `duration_months` > 4 months), expert skills with 0 duration, and yoe vs career span mismatches.

**Hard penalties**:
- Entirely consulting background (TCS, Infosys, Wipro, etc.) → 0.5× score
- Non-tech title (Marketing Manager, Operations Manager, etc.) → 0.25× score

**Reasoning**: Each of the top 100 entries has a fact-based, non-templated 1–2 sentence justification referencing specific profile details (title, YOE, career keywords, notice period, GitHub score, recency).

---

## 🛠️ AI Recruiter Web App

A full-stack platform that acts as an automated first-round technical interview.

### Features

- **Resume parsing**: Upload a PDF and automatically extract tech stack and skills
- **GitHub fact-checking**: Pings the GitHub API to verify languages, commit frequency, and public repos
- **Proctored tech test**: Candidates take a cheat-proof MCQ test with tab-switch and copy-paste detection
- **Recruiter dashboard**: Analytics-heavy view with automated scores, breakdown, and one-click shortlisting

### Stack

- **Frontend**: Next.js (App Router), React 19, Tailwind CSS v4, Shadcn UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite via Prisma ORM (swap to Postgres for production)

### Getting Started

```bash
# Backend (runs on http://localhost:3001)
cd backend
npm install
npx prisma db push
npm run dev

# Frontend (runs on http://localhost:3000)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the app.
