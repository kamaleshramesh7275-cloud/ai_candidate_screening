import { Request, Response } from 'express';
import { prisma } from '../index';

// Get all candidates with their applications (for recruiter overview)
export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        applications: {
          include: { job: { select: { title: true, companyName: true } } },
          orderBy: { overallScore: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ candidates });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update application status (e.g. Shortlisted / Rejected)
export const updateCandidateStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string; // applicationId
    const { status } = req.body;

    const application = await prisma.jobApplication.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ application });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update recruiter notes on an application
export const updateCandidateNotes = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string; // applicationId
    const { notes } = req.body;

    const application = await prisma.jobApplication.update({
      where: { id },
      data: { recruiterNotes: notes },
    });

    res.status(200).json({ application });
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
