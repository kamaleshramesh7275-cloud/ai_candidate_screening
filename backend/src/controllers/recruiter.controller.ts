import { Request, Response } from 'express';
import { prisma } from '../index';

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { overallScore: 'desc' }
    });
    res.status(200).json({ candidates });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateCandidateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const candidate = await prisma.candidate.update({
      where: { id: id as string },
      data: { status }
    });

    res.status(200).json({ candidate });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateCandidateNotes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const candidate = await prisma.candidate.update({
      where: { id: id as string },
      data: { recruiterNotes: notes }
    });

    res.status(200).json({ candidate });
  } catch (error) {
    console.error('Error updating candidate notes:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
