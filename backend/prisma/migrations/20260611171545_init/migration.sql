-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "linkedInUrl" TEXT,
    "githubUrl" TEXT,
    "resumeText" TEXT,
    "domain" TEXT,
    "resumeScore" REAL,
    "githubScore" REAL,
    "linkedInScore" REAL,
    "skillsMatchLog" TEXT,
    "testCompleted" BOOLEAN NOT NULL DEFAULT false,
    "testScore" REAL,
    "cheatStrikes" INTEGER NOT NULL DEFAULT 0,
    "cheatLog" TEXT,
    "overallScore" REAL,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Recruiter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Recruiter_email_key" ON "Recruiter"("email");
