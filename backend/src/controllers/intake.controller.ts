import { Request, Response } from 'express';
import { prisma } from '../index';
import { parseResume } from '../services/resume.service';
import { fetchGitHubData } from '../services/github.service';
import { scrapeLinkedIn } from '../services/linkedin.service';
import { verifySkills } from '../services/verification.service';
import { calculateResumeScore, calculateGithubScore, calculateLinkedInScore } from '../services/scoring.service';

export const handleIntake = async (req: Request, res: Response) => {
  try {
    const { name, email, linkedInUrl, githubUrl, domain } = req.body;
    const resumeBuffer = req.file?.buffer;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    // 1. Parse Resume (if provided)
    let resumeText = '';
    if (resumeBuffer) {
      resumeText = await parseResume(resumeBuffer);
    }

    // 2. Fetch GitHub Data
    let githubData = null;
    if (githubUrl) {
      githubData = await fetchGitHubData(githubUrl);
    }

    // 3. Scrape LinkedIn (or fallback)
    let linkedInData = null;
    if (linkedInUrl) {
      linkedInData = await scrapeLinkedIn(linkedInUrl);
    }

    // 4. Verify Skills (cross-check resume vs github languages)
    let skillsMatchLog = {};
    if (resumeText && githubData && githubData.languages) {
      skillsMatchLog = verifySkills(resumeText, Object.keys(githubData.languages));
    }

    // 5. Calculate Initial Scores
    const resumeScore = calculateResumeScore(resumeText, domain);
    const githubScore = githubData ? calculateGithubScore(githubData) : 0;
    const linkedInScore = calculateLinkedInScore(linkedInUrl, linkedInData);

    // Save to Database
    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        linkedInUrl,
        githubUrl,
        resumeText,
        domain,
        resumeScore,
        githubScore,
        linkedInScore,
        skillsMatchLog: JSON.stringify(skillsMatchLog),
        githubRawData: githubData ? JSON.stringify(githubData) : null,
        linkedInRawData: linkedInData ? JSON.stringify(linkedInData) : null,
      },
    });

    res.status(201).json({
      message: 'Candidate intake successful',
      candidateId: candidate.id,
      scores: {
        resume: resumeScore,
        github: githubScore,
        linkedin: linkedInScore,
      },
    });
  } catch (error) {
    console.error('Error during intake:', error);
    res.status(500).json({ error: 'Internal server error during intake.' });
  }
};
