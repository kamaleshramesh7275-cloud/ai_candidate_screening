const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const applications = await prisma.jobApplication.findMany({
    where: {
      overallScore: null
    }
  });

  for (const app of applications) {
    const resumeScore = Math.floor(Math.random() * 41) + 60; // 60 to 100
    const githubScore = Math.floor(Math.random() * 41) + 60;
    const testScore = Math.floor(Math.random() * 41) + 60;
    const cheatStrikes = Math.floor(Math.random() * 2); // 0 or 1
    const overallScore = (resumeScore * 0.25) + (githubScore * 0.25) + (testScore * 0.50) - (cheatStrikes * 5);
    
    await prisma.jobApplication.update({
      where: { id: app.id },
      data: {
        resumeScore,
        githubScore,
        testScore,
        cheatStrikes,
        overallScore,
        testCompleted: true,
        status: 'Tested'
      }
    });
  }
  console.log(`Updated ${applications.length} applications with random scores.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
