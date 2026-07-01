import { Request, Response } from 'express';
import { prisma } from '../index';
import { parseResume } from '../services/resume.service';
import { fetchGitHubData } from '../services/github.service';
import { scrapeLinkedIn } from '../services/linkedin.service';
import { verifySkills } from '../services/verification.service';
import { calculateResumeScore, calculateGithubScore, calculateLinkedInScore } from '../services/scoring.service';

// Called when a candidate applies to a specific job.
// Scores their existing profile data against the job's domain.
export const handleIntake = async (req: Request, res: Response) => {
  try {
    const { candidateId, jobId } = req.body;
    const resumeBuffer = req.file?.buffer;

    if (!candidateId || !jobId) {
      return res.status(400).json({ error: 'candidateId and jobId are required.' });
    }

    // Fetch candidate profile and job details
    const [candidate, job] = await Promise.all([
      prisma.candidate.findUnique({ where: { id: candidateId } }),
      prisma.job.findUnique({ where: { id: jobId } }),
    ]);

    if (!candidate) return res.status(404).json({ error: 'Candidate not found.' });
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    const domain = job.domain;

    // 1. Parse Resume — use uploaded file if provided, else fall back to stored resumeText
    let resumeText = candidate.resumeText || '';
    let githubRawData = candidate.githubRawData ? JSON.parse(candidate.githubRawData) : null;
    let linkedInRawData = candidate.linkedInRawData ? JSON.parse(candidate.linkedInRawData) : null;

    if (resumeBuffer) {
      resumeText = await parseResume(resumeBuffer);
      // Update candidate's stored resume text
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { resumeText },
      });
    }

    // 2. Fetch GitHub Data (use cache if available)
    if (candidate.githubUrl && !githubRawData) {
      githubRawData = await fetchGitHubData(candidate.githubUrl);
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { githubRawData: JSON.stringify(githubRawData) },
      });
    }

    // 3. Scrape LinkedIn (use cache if available)
    if (candidate.linkedInUrl && !linkedInRawData) {
      linkedInRawData = await scrapeLinkedIn(candidate.linkedInUrl);
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { linkedInRawData: JSON.stringify(linkedInRawData) },
      });
    }

    // 4. Verify Skills (cross-check resume vs github languages)
    let skillsMatchLog = {};
    if (resumeText && githubRawData?.languages) {
      skillsMatchLog = verifySkills(resumeText, Object.keys(githubRawData.languages));
    }

    // 5. Calculate Scores against this specific job's domain
    const resumeScore = calculateResumeScore(resumeText, domain);
    const githubScore = githubRawData ? calculateGithubScore(githubRawData) : 0;
    const linkedInScore = calculateLinkedInScore(candidate.linkedInUrl ?? undefined, linkedInRawData);

    // 6. Update JobApplication with scores
    const application = await prisma.jobApplication.update({
      where: { candidateId_jobId: { candidateId, jobId } },
      data: {
        resumeScore,
        githubScore,
        linkedInScore,
        skillsMatchLog: JSON.stringify(skillsMatchLog),
        status: 'Evaluated',
      },
    });

    res.status(200).json({
      message: 'Profile evaluated for this job',
      applicationId: application.id,
      scores: { resume: resumeScore, github: githubScore, linkedin: linkedInScore },
    });
  } catch (error) {
    console.error('Error during intake:', error);
    res.status(500).json({ error: 'Internal server error during intake.' });
  }
};
