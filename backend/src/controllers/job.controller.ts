import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, companyName, salary, description, recruiterId } = req.body;

    if (!title || !companyName || !salary || !description || !recruiterId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const job = await prisma.job.create({
      data: {
        title,
        companyName,
        salary,
        description,
        recruiterId,
      },
    });

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

export const getJobsForRecruiter = async (req: Request, res: Response) => {
  try {
    const { recruiterId } = req.params;

    if (!recruiterId) {
      return res.status(400).json({ error: 'Recruiter ID is required' });
    }

    const jobs = await prisma.job.findMany({
      where: { recruiterId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};
