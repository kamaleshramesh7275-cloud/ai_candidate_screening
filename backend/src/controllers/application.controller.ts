import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all applications for a candidate (with job info)
export const getCandidateApplications = async (req: Request, res: Response) => {
  try {
    const candidateId = req.params.candidateId as string;
    const applications = await prisma.jobApplication.findMany({
      where: { candidateId },
      include: {
        job: {
          include: { recruiter: { select: { name: true, company: true } } },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
    res.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Get a single application
export const getApplication = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        job: true,
        candidate: { select: { name: true, email: true, githubUrl: true, linkedInUrl: true } },
      },
    });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json({ application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

// Get all applications for a specific job (recruiter view)
export const getApplicationsForJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string;
    const applications = await prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        candidate: {
          select: { id: true, name: true, email: true, githubUrl: true, linkedInUrl: true, githubRawData: true },
        },
      },
      orderBy: [{ overallScore: 'desc' }, { appliedAt: 'desc' }],
    });
    res.json({ applications });
  } catch (error) {
    console.error('Error fetching applications for job:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Update application status (recruiter)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { status },
    });
    res.json({ application: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Update recruiter notes on an application
export const updateApplicationNotes = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { notes } = req.body;
    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { recruiterNotes: notes },
    });
    res.json({ application: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notes' });
  }
};
