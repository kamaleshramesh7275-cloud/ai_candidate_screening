import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { parseResume } from '../services/resume.service';
import { sendWelcomeEmail, sendLoginAlertEmail } from '../services/email.service';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretrecruiterjwttokenkey';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ── SESSION ──────────────────────────────────────────────────────────────────

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.auth_token;
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string; name: string; email: string; company?: string };
    res.json({ id: payload.id, role: payload.role, name: payload.name, email: payload.email, company: payload.company });
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out successfully' });
};

// ── RECRUITER AUTH ──────────────────────────────────────────────────────────

export const recruiterRegister = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, company } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email and password are required' });
    return;
  }

  try {
    const existing = await prisma.recruiter.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const recruiter = await prisma.recruiter.create({
      data: { name, email, password: hashed, company },
    });

    const token = jwt.sign({ id: recruiter.id, role: 'recruiter', name: recruiter.name, email: recruiter.email, company: recruiter.company }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth_token', token, COOKIE_OPTS);
    res.status(201).json({ id: recruiter.id, name: recruiter.name, email: recruiter.email, role: 'recruiter' });
    
    // Fire and forget welcome email
    sendWelcomeEmail(recruiter.email, recruiter.name, 'recruiter');
  } catch (err) {
    console.error('Recruiter register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const recruiterLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const recruiter = await prisma.recruiter.findUnique({ where: { email } });
    if (!recruiter) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const valid = await bcrypt.compare(password, recruiter.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: recruiter.id, role: 'recruiter', name: recruiter.name, email: recruiter.email, company: recruiter.company }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth_token', token, COOKIE_OPTS);
    res.json({ id: recruiter.id, name: recruiter.name, email: recruiter.email, role: 'recruiter' });

    // Fire and forget login alert
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'Unknown';
    sendLoginAlertEmail(recruiter.email, recruiter.name, 'recruiter', ip);
  } catch (err) {
    console.error('Recruiter login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ── CANDIDATE AUTH ──────────────────────────────────────────────────────────

export const candidateRegister = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, githubUrl, linkedInUrl } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email and password are required' });
    return;
  }

  try {
    const existing = await prisma.candidate.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    // Parse uploaded resume PDF if provided
    let resumeText: string | null = null;
    const resumeFile = (req as any).file as Express.Multer.File | undefined;
    if (resumeFile?.buffer) {
      resumeText = await parseResume(resumeFile.buffer);
    }

    const hashed = await bcrypt.hash(password, 10);
    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        password: hashed,
        githubUrl: githubUrl || null,
        linkedInUrl: linkedInUrl || null,
        resumeText: resumeText || null,
      },
    });

    const token = jwt.sign({ id: candidate.id, role: 'candidate', name: candidate.name, email: candidate.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth_token', token, COOKIE_OPTS);
    res.status(201).json({ id: candidate.id, name: candidate.name, email: candidate.email, role: 'candidate' });

    // Fire and forget welcome email
    sendWelcomeEmail(candidate.email, candidate.name, 'candidate');
  } catch (err) {
    console.error('Candidate register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const candidateLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const candidate = await prisma.candidate.findUnique({ where: { email } });
    if (!candidate || !candidate.password) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const valid = await bcrypt.compare(password, candidate.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: candidate.id, role: 'candidate', name: candidate.name, email: candidate.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth_token', token, COOKIE_OPTS);
    res.json({ id: candidate.id, name: candidate.name, email: candidate.email, role: 'candidate' });

    // Fire and forget login alert
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'Unknown';
    sendLoginAlertEmail(candidate.email, candidate.name, 'candidate', ip);
  } catch (err) {
    console.error('Candidate login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getCandidateProfile = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        applications: {
          include: { job: true },
          orderBy: { appliedAt: 'desc' },
        },
      },
    });
    if (!candidate) {
      res.status(404).json({ error: 'Candidate not found' });
      return;
    }
    res.json({ candidate });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
