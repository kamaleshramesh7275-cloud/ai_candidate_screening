import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { handleIntake } from './controllers/intake.controller';
import { recruiterLogin } from './controllers/auth.controller';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Set up multer for memory storage (for resume PDF uploads)
const upload = multer({ storage: multer.memoryStorage() });

import { generateTest, submitTest } from './controllers/test.controller';
import { getCandidates, updateCandidateStatus, updateCandidateNotes } from './controllers/recruiter.controller';
import { createJob, getJobsForRecruiter } from './controllers/job.controller';
import { scheduleInterview, getCandidateInterviews, getRecruiterInterviews } from './controllers/interview.controller';

// Middleware to protect recruiter routes
const authenticateRecruiter = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const jwtSecret = process.env.JWT_SECRET || 'supersecretrecruiterjwttokenkey';
    jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token.' });
  }
};

// Routes
app.post('/api/candidates/intake', upload.single('resume'), handleIntake);
app.get('/api/test/generate/:domain', generateTest);
app.post('/api/test/submit', submitTest);

// Recruiter Auth
app.post('/api/recruiter/login', recruiterLogin);

// Protected Recruiter Routes
app.get('/api/recruiter/candidates', authenticateRecruiter, getCandidates);
app.patch('/api/recruiter/candidates/:id/status', authenticateRecruiter, updateCandidateStatus);
app.patch('/api/recruiter/candidates/:id/notes', authenticateRecruiter, updateCandidateNotes);

// Jobs
app.post('/api/jobs', authenticateRecruiter, createJob);
app.get('/api/jobs/recruiter/:recruiterId', authenticateRecruiter, getJobsForRecruiter);

// Interviews
app.post('/api/interviews', authenticateRecruiter, scheduleInterview);
app.get('/api/interviews/recruiter/:recruiterId', authenticateRecruiter, getRecruiterInterviews);
app.get('/api/interviews/candidate/:candidateId', getCandidateInterviews);

// Serve static files from the Next.js export in production
app.use(express.static(path.join(__dirname, '../../frontend/out')));

// Catch-all middleware to hand off client-side routing to Next.js
app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/out/index.html'));
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

export { prisma };
