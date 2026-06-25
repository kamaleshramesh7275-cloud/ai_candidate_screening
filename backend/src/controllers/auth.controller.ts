import { Request, Response } from 'express';
import { prisma } from '../index';
import crypto from 'crypto';

const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const candidateRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const existingCandidate = await prisma.candidate.findUnique({
      where: { email }
    });
    if (existingCandidate) {
      return res.status(400).json({ error: 'A candidate with this email address already exists.' });
    }

    const hashedPassword = hashPassword(password);
    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: 'Candidate registration successful.',
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      role: 'candidate'
    });
  } catch (error) {
    console.error('Candidate registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

export const candidateLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { email }
    });
    if (!candidate || !candidate.password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const hashedPassword = hashPassword(password);
    if (candidate.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful.',
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      role: 'candidate'
    });
  } catch (error) {
    console.error('Candidate login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
};

export const recruiterRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const existingRecruiter = await prisma.recruiter.findUnique({
      where: { email }
    });
    if (existingRecruiter) {
      return res.status(400).json({ error: 'A recruiter with this email address already exists.' });
    }

    const hashedPassword = hashPassword(password);
    const recruiter = await prisma.recruiter.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: 'Recruiter registration successful.',
      id: recruiter.id,
      name: recruiter.name,
      email: recruiter.email,
      role: 'recruiter'
    });
  } catch (error) {
    console.error('Recruiter registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

export const recruiterLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { email }
    });
    if (!recruiter) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const hashedPassword = hashPassword(password);
    if (recruiter.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful.',
      id: recruiter.id,
      name: recruiter.name,
      email: recruiter.email,
      role: 'recruiter'
    });
  } catch (error) {
    console.error('Recruiter login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
};

export const getCandidateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const candidate = await prisma.candidate.findUnique({
      where: { id: id as string }
    });
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }
    res.status(200).json({ candidate });
  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
