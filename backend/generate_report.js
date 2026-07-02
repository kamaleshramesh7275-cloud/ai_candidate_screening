const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const applications = await prisma.jobApplication.findMany({
    include: {
      candidate: true,
      job: true,
    },
    orderBy: {
      overallScore: 'desc'
    }
  });

  const data = applications.map(app => ({
    CandidateName: app.candidate.name,
    CandidateEmail: app.candidate.email,
    JobTitle: app.job.title,
    JobDomain: app.job.domain,
    Status: app.status,
    OverallScore: app.overallScore,
    ResumeScore: app.resumeScore,
    GithubScore: app.githubScore,
    TestScore: app.testScore,
    CheatStrikes: app.cheatStrikes,
    AppliedAt: app.appliedAt.toISOString()
  }));

  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Ranked Candidates');

  const outputPath = path.resolve(__dirname, '../../ranked_candidates_final.xlsx');
  
  xlsx.writeFile(workbook, outputPath);
  console.log(`Successfully generated report at ${outputPath}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
