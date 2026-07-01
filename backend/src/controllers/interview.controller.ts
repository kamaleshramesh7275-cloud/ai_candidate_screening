import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const scheduleInterview = async (req: Request, res: Response) => {
  try {
    const { candidateId, jobId, scheduledTime } = req.body;

    if (!candidateId || !jobId || !scheduledTime) {
      return res.status(400).json({ error: 'candidateId, jobId, and scheduledTime are required' });
    }

    const interview = await prisma.interview.create({
      data: {
        candidateId,
        jobId,
        scheduledTime: new Date(scheduledTime),
      },
      include: {
        job: true,
        candidate: true,
      }
    });

    res.status(201).json({ message: 'Interview scheduled successfully', interview });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
};

export const getCandidateInterviews = async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID is required' });
    }

    const interviews = await prisma.interview.findMany({
      where: { candidateId: candidateId as string },
      include: {
        job: true,
      },
      orderBy: { scheduledTime: 'asc' },
    });

    res.status(200).json({ interviews });
  } catch (error) {
    console.error('Error fetching candidate interviews:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
};

export const getRecruiterInterviews = async (req: Request, res: Response) => {
  try {
    const { recruiterId } = req.params;

    if (!recruiterId) {
      return res.status(400).json({ error: 'Recruiter ID is required' });
    }

    const interviews = await prisma.interview.findMany({
      where: {
        job: {
          recruiterId: recruiterId as string
        }
      },
      include: {
        job: true,
        candidate: true,
      },
      orderBy: { scheduledTime: 'asc' },
    });

    res.status(200).json({ interviews });
  } catch (error) {
    console.error('Error fetching recruiter interviews:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
};
