import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendNewJobEmail } from '../services/email.service';

const prisma = new PrismaClient();

// Create a job posting (recruiter only)
export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, companyName, salary, description, domain, recruiterId } = req.body;

    if (!title || !companyName || !salary || !description || !recruiterId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const job = await prisma.job.create({
      data: {
        title,
        companyName,
        salary,
        description,
        domain: domain || 'General CS',
        recruiterId,
      },
    });

    res.status(201).json({ message: 'Job created successfully', job });

    // Fire and forget new job notification to all candidates
    const candidates = await prisma.candidate.findMany({ select: { name: true, email: true } });
    sendNewJobEmail(candidates, job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

// Get all open jobs — public endpoint for candidate job board
export const getAllOpenJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { isOpen: true },
      include: {
        recruiter: { select: { name: true, company: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get jobs for a specific recruiter
export const getJobsForRecruiter = async (req: Request, res: Response) => {
  try {
    const recruiterId = req.params.recruiterId as string;

    if (!recruiterId) {
      return res.status(400).json({ error: 'Recruiter ID is required' });
    }

    const jobs = await prisma.job.findMany({
      where: { recruiterId },
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Candidate applies to a job — creates JobApplication record
export const applyToJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string;
    const { candidateId } = req.body;

    if (!candidateId) return res.status(400).json({ error: 'candidateId is required' });

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || !job.isOpen) return res.status(404).json({ error: 'Job not found or no longer open' });

    // Check for existing application
    const existing = await prisma.jobApplication.findUnique({
      where: { candidateId_jobId: { candidateId, jobId } },
    });
    if (existing) {
      return res.json({ message: 'Already applied', application: existing });
    }

    const application = await prisma.jobApplication.create({
      data: { candidateId, jobId },
    });

    res.status(201).json({ message: 'Applied successfully', application });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ error: 'Failed to apply' });
  }
};

// Toggle job open/closed
export const toggleJobStatus = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string;
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: { isOpen: !job.isOpen },
    });
    res.json({ job: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle job status' });
  }
};
