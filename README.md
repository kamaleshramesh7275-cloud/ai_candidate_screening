# AI Recruiter 

Let's face it: hiring software engineers is hard. Resumes can be exaggerated, and manual technical screening takes way too much time. I built **AI Recruiter** to fix that. 

It's a full-stack platform that acts as an automated first-round technical interview. Instead of just reading a PDF, it actually checks a candidate's public GitHub to see if they write code as well as they say they do, and then gives them a quick, cheat-proof test.

##  What it actually does:

*   **Reads the Resume for You**: Upload a PDF, and the app automatically pulls out the relevant tech stack and skills.
*   **Fact-Checks with GitHub**: It pings the GitHub API to verify the candidate's languages, checks how often they actually commit code, and looks at their public repos.
*   **Proctored Tech Test**: Candidates take a quick multiple-choice test in a secure environment. If they try to switch tabs, copy-paste answers, or open developer tools, the system flags it and can auto-fail them after 3 strikes.
*   **The Recruiter Dashboard**: Hiring managers get a clean, analytics-heavy dashboard. You can see a breakdown of everyone who applied, their automated scores (combining resume, GitHub, and test results), and decide who to shortlist with one click.

##  How I built it:

I wanted this to be fast and modern, so here is the stack I went with:

*   **Frontend**: Next.js (App Router) with React 19. I styled it using Tailwind CSS v4 and Shadcn UI to make it look clean and professional.
*   **Backend**: Node.js and Express built with TypeScript.
*   **Database**: SQLite for easy local setup, connected via Prisma ORM. (It's super easy to swap this to Postgres for production).

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
# Set up the database (SQLite)
npx prisma db push
# Start the server (runs on http://localhost:3001)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Start the development server (runs on http://localhost:3000)
npm run dev
```

Visit `http://localhost:3000` to see the app in action!

---
*Updated by AI Assistant*
