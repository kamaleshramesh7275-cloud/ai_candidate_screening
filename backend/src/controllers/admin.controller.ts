import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── GET /api/admin/stats ───────────────────────────────────────────────────────
export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalCandidates,
      totalRecruiters,
      totalJobs,
      totalApplications,
      completedTests,
      avgScoreResult,
      domainCounts,
      statusCounts,
      topCandidates,
    ] = await Promise.all([
      prisma.candidate.count(),
      prisma.recruiter.count(),
      prisma.job.count(),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { testCompleted: true } }),
      prisma.jobApplication.aggregate({
        where: { overallScore: { not: null } },
        _avg: { overallScore: true, testScore: true, resumeScore: true },
      }),
      prisma.job.groupBy({ by: ['domain'], _count: { id: true } }),
      prisma.jobApplication.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.jobApplication.findMany({
        where: { overallScore: { not: null } },
        orderBy: { overallScore: 'desc' },
        take: 5,
        include: { candidate: { select: { name: true, email: true } }, job: { select: { title: true } } },
      }),
    ]);

    res.json({
      totalCandidates,
      totalRecruiters,
      totalJobs,
      totalApplications,
      completedTests,
      avgOverallScore: avgScoreResult._avg.overallScore ?? 0,
      avgTestScore: avgScoreResult._avg.testScore ?? 0,
      domainBreakdown: domainCounts.map(d => ({ domain: d.domain, count: d._count.id })),
      statusBreakdown: statusCounts.map(s => ({ status: s.status, count: s._count.id })),
      topCandidates: topCandidates.map(a => ({
        candidateName: a.candidate.name,
        candidateEmail: a.candidate.email,
        jobTitle: a.job.title,
        overallScore: a.overallScore,
        testScore: a.testScore,
      })),
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// ── GET /api/admin/candidates ─────────────────────────────────────────────────
export const getAdminCandidates = async (_req: Request, res: Response): Promise<void> => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        applications: {
          include: {
            job: {
              include: { recruiter: { select: { name: true, company: true } } },
            },
          },
          orderBy: { appliedAt: 'desc' },
        },
      },
    });

    const result = candidates.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      githubUrl: c.githubUrl,
      linkedInUrl: c.linkedInUrl,
      createdAt: c.createdAt,
      totalApplications: c.applications.length,
      completedTests: c.applications.filter(a => a.testCompleted).length,
      avgOverallScore:
        c.applications.filter(a => a.overallScore !== null).length > 0
          ? c.applications.filter(a => a.overallScore !== null).reduce((sum, a) => sum + (a.overallScore ?? 0), 0) /
            c.applications.filter(a => a.overallScore !== null).length
          : null,
      applications: c.applications.map(a => ({
        id: a.id,
        jobTitle: a.job.title,
        companyName: a.job.companyName,
        recruiterName: a.job.recruiter.name,
        domain: a.job.domain,
        status: a.status,
        testCompleted: a.testCompleted,
        testScore: a.testScore,
        resumeScore: a.resumeScore,
        githubScore: a.githubScore,
        overallScore: a.overallScore,
        cheatStrikes: a.cheatStrikes,
        appliedAt: a.appliedAt,
      })),
    }));

    res.json({ candidates: result });
  } catch (err) {
    console.error('Admin candidates error:', err);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
};

// ── GET /api/admin/recruiters ─────────────────────────────────────────────────
export const getAdminRecruiters = async (_req: Request, res: Response): Promise<void> => {
  try {
    const recruiters = await prisma.recruiter.findMany({
      orderBy: { name: 'asc' },
      include: {
        jobs: {
          include: { _count: { select: { applications: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const result = recruiters.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      company: r.company,
      totalJobs: r.jobs.length,
      totalApplicationsReceived: r.jobs.reduce((sum, j) => sum + j._count.applications, 0),
      jobs: r.jobs.map(j => ({
        id: j.id,
        title: j.title,
        domain: j.domain,
        salary: j.salary,
        isOpen: j.isOpen,
        applicationCount: j._count.applications,
        createdAt: j.createdAt,
      })),
    }));

    res.json({ recruiters: result });
  } catch (err) {
    console.error('Admin recruiters error:', err);
    res.status(500).json({ error: 'Failed to fetch recruiters' });
  }
};

// ── GET /api/admin/applications ────────────────────────────────────────────────
export const getAdminApplications = async (_req: Request, res: Response): Promise<void> => {
  try {
    const applications = await prisma.jobApplication.findMany({
      orderBy: { appliedAt: 'desc' },
      include: {
        candidate: { select: { id: true, name: true, email: true } },
        job: {
          select: {
            id: true, title: true, domain: true, companyName: true,
            recruiter: { select: { name: true } },
          },
        },
      },
    });

    res.json({
      applications: applications.map(a => ({
        id: a.id,
        candidateName: a.candidate.name,
        candidateEmail: a.candidate.email,
        candidateId: a.candidate.id,
        jobTitle: a.job.title,
        jobId: a.job.id,
        domain: a.job.domain,
        companyName: a.job.companyName,
        recruiterName: a.job.recruiter.name,
        status: a.status,
        testCompleted: a.testCompleted,
        testScore: a.testScore,
        resumeScore: a.resumeScore,
        githubScore: a.githubScore,
        overallScore: a.overallScore,
        cheatStrikes: a.cheatStrikes,
        appliedAt: a.appliedAt,
      })),
    });
  } catch (err) {
    console.error('Admin applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};
