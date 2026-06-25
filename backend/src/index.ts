import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { handleIntake } from './controllers/intake.controller';

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
import {
  candidateRegister,
  candidateLogin,
  recruiterRegister,
  recruiterLogin,
  getCandidateProfile
} from './controllers/auth.controller';

// Routes
app.post('/api/auth/candidate/register', candidateRegister);
app.post('/api/auth/candidate/login', candidateLogin);
app.post('/api/auth/recruiter/register', recruiterRegister);
app.post('/api/auth/recruiter/login', recruiterLogin);
app.get('/api/candidate/profile/:id', getCandidateProfile);

app.post('/api/candidates/intake', upload.single('resume'), handleIntake);
app.get('/api/test/generate/:domain', generateTest);
app.post('/api/test/submit', submitTest);

app.get('/api/recruiter/candidates', getCandidates);
app.patch('/api/recruiter/candidates/:id/status', updateCandidateStatus);
app.patch('/api/recruiter/candidates/:id/notes', updateCandidateNotes);

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

export { prisma };
