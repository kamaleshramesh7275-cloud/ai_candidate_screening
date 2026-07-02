import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { handleIntake } from './controllers/intake.controller';
import {
  recruiterLogin, recruiterRegister,
  candidateLogin, candidateRegister,
  getMe, logout, getCandidateProfile,
} from './controllers/auth.controller';
import { generateTest, submitTest } from './controllers/test.controller';
import { getCandidates, updateCandidateStatus, updateCandidateNotes } from './controllers/recruiter.controller';
import { createJob, getAllOpenJobs, getJobsForRecruiter, applyToJob, toggleJobStatus } from './controllers/job.controller';
import { scheduleInterview, getCandidateInterviews, getRecruiterInterviews } from './controllers/interview.controller';
import {
  getCandidateApplications, getApplication,
  getApplicationsForJob, updateApplicationStatus, updateApplicationNotes,
} from './controllers/application.controller';
import {
  getAdminStats, getAdminCandidates, getAdminRecruiters, getAdminApplications
} from './controllers/admin.controller';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretrecruiterjwttokenkey';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'superadmin123';

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // required for cookies
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

const upload = multer({ storage: multer.memoryStorage() });

// ── AUTH MIDDLEWARE ───────────────────────────────────────────────────────────
const authenticateAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Admin access denied. No token provided.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_SECRET) {
    res.status(403).json({ success: false, message: 'Invalid admin token.' });
    return;
  }
  next();
};

const authenticateRecruiter = (req: Request, res: Response, next: NextFunction): void => {
  // Support both cookie and Authorization header (for backward compat)
  const token = req.cookies?.auth_token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== 'recruiter') {
      res.status(403).json({ success: false, message: 'Recruiter access required.' });
      return;
    }
    (req as any).user = payload;
    next();
  } catch {
    res.status(403).json({ success: false, message: 'Invalid token.' });
  }
};

const authenticateCandidate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.auth_token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== 'candidate') {
      res.status(403).json({ success: false, message: 'Candidate access required.' });
      return;
    }
    (req as any).user = payload;
    next();
  } catch {
    res.status(403).json({ success: false, message: 'Invalid token.' });
  }
};

// ── ADMIN ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/admin/stats', authenticateAdmin, getAdminStats);
app.get('/api/admin/candidates', authenticateAdmin, getAdminCandidates);
app.get('/api/admin/recruiters', authenticateAdmin, getAdminRecruiters);
app.get('/api/admin/applications', authenticateAdmin, getAdminApplications);

// ── SESSION ROUTES ────────────────────────────────────────────────────────────
app.get('/api/auth/me', getMe);
app.post('/api/auth/logout', logout);

// ── RECRUITER AUTH ────────────────────────────────────────────────────────────
app.post('/api/recruiter/register', recruiterRegister);
app.post('/api/recruiter/login', recruiterLogin);

// ── CANDIDATE AUTH ────────────────────────────────────────────────────────────
app.post('/api/candidate/register', upload.single('resume'), candidateRegister);
app.post('/api/candidate/login', candidateLogin);
app.get('/api/candidate/profile/:id', getCandidateProfile);

// ── JOBS (public) ─────────────────────────────────────────────────────────────
app.get('/api/jobs', getAllOpenJobs);

// ── JOBS (protected) ─────────────────────────────────────────────────────────
app.post('/api/jobs', authenticateRecruiter, createJob);
app.get('/api/jobs/recruiter/:recruiterId', authenticateRecruiter, getJobsForRecruiter);
app.patch('/api/jobs/:jobId/toggle', authenticateRecruiter, toggleJobStatus);
app.post('/api/jobs/:jobId/apply', authenticateCandidate, applyToJob);

// ── CANDIDATE INTAKE (profile evaluation for a job) ──────────────────────────
app.post('/api/candidates/intake', upload.single('resume'), handleIntake);

// ── TEST ──────────────────────────────────────────────────────────────────────
app.get('/api/test/generate/:applicationId', generateTest);
app.post('/api/test/submit', submitTest);

// ── APPLICATIONS ──────────────────────────────────────────────────────────────
app.get('/api/applications/candidate/:candidateId', getCandidateApplications);
app.get('/api/applications/job/:jobId', authenticateRecruiter, getApplicationsForJob);
app.get('/api/applications/:id', getApplication);
app.patch('/api/applications/:id/status', authenticateRecruiter, updateApplicationStatus);
app.patch('/api/applications/:id/notes', authenticateRecruiter, updateApplicationNotes);

// ── RECRUITER (candidates overview) ──────────────────────────────────────────
app.get('/api/recruiter/candidates', authenticateRecruiter, getCandidates);
app.patch('/api/recruiter/candidates/:id/status', authenticateRecruiter, updateCandidateStatus);
app.patch('/api/recruiter/candidates/:id/notes', authenticateRecruiter, updateCandidateNotes);

// ── INTERVIEWS ────────────────────────────────────────────────────────────────
app.post('/api/interviews', authenticateRecruiter, scheduleInterview);
app.get('/api/interviews/recruiter/:recruiterId', authenticateRecruiter, getRecruiterInterviews);
app.get('/api/interviews/candidate/:candidateId', getCandidateInterviews);

// ── STATIC / CATCH-ALL ────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../../frontend/out')));
app.use((_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/out/index.html'));
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

export { prisma };
