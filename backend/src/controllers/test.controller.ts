import { Request, Response } from 'express';
import { prisma } from '../index';
import questionsDb from '../questions.json';
import { sendTestResultEmail } from '../services/email.service';

export const generateTest = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.applicationId as string;

    // Look up the application to get the job domain
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    const domain = application.job.domain || 'General CS';
    const allQuestions = (questionsDb as Record<string, any[]>)[domain] || (questionsDb as Record<string, any[]>)['General CS'];

    const testQuestions = allQuestions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    // Randomize order
    testQuestions.sort(() => Math.random() - 0.5);

    // Record test start time
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { testStartTime: new Date() },
    }).catch(err => console.error('Error updating testStartTime:', err));

    res.status(200).json({ questions: testQuestions, domain });
  } catch (error) {
    console.error('Error generating test:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const submitTest = async (req: Request, res: Response) => {
  try {
    const { applicationId, answers, cheatStrikes, cheatLog, codeReplayData, videoRecording } = req.body;

    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId as string },
      include: { 
        job: { include: { recruiter: true } },
        candidate: true
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    if (application.testCompleted) {
      return res.status(400).json({ error: 'Test already completed.' });
    }

    const domain = application.job.domain || 'General CS';
    const allQuestions = (questionsDb as Record<string, any[]>)[domain] || (questionsDb as Record<string, any[]>)['General CS'];

    // Server-side time validation
    let finalCheatStrikes = cheatStrikes;
    const updatedCheatLog = [...(cheatLog || [])];

    if (application.testStartTime) {
      const startTime = new Date(application.testStartTime).getTime();
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const maxAllowedSeconds = (allQuestions.length * 120) + 120; // 2 min per question + buffer

      if (elapsedSeconds > maxAllowedSeconds) {
        finalCheatStrikes = Math.min(3, finalCheatStrikes + 2);
        updatedCheatLog.push({
          type: 'Server-side Time Limit Exceeded',
          timestamp: new Date().toISOString(),
          details: `Elapsed: ${Math.round(elapsedSeconds)}s, Max: ${maxAllowedSeconds}s`,
        });
      }
    }

    // Score answers
    let correctCount = 0;
    Object.keys(answers).forEach(questionId => {
      const q = allQuestions.find((q: any) => q.id === questionId);
      if (q && q.answer === answers[questionId]) correctCount++;
    });

    // Test score: (correct/total * 100) - (strikes * 5)
    let testScore = (correctCount / allQuestions.length) * 100;
    testScore -= finalCheatStrikes * 5;
    testScore = Math.max(testScore, 0);

    // Weighted overall: Resume 25% + GitHub 25% + Test 50%
    const overallScore =
      ((application.resumeScore || 0) * 0.25) +
      ((application.githubScore || 0) * 0.25) +
      (testScore * 0.50);

    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        testCompleted: true,
        testScore,
        cheatStrikes: finalCheatStrikes,
        cheatLog: JSON.stringify(updatedCheatLog),
        codeReplayData: codeReplayData ? JSON.stringify(codeReplayData) : null,
        videoRecording,
        overallScore,
        status: 'Tested',
      },
    });

    res.status(200).json({ message: 'Test submitted successfully', testScore, overallScore });

    // Fire and forget test result email to recruiter
    if (application.job.recruiter && application.candidate) {
      sendTestResultEmail(
        { email: application.job.recruiter.email, name: application.job.recruiter.name },
        { name: application.candidate.name, email: application.candidate.email },
        { title: application.job.title, companyName: application.job.companyName },
        {
          testScore,
          resumeScore: application.resumeScore,
          githubScore: application.githubScore,
          overallScore,
          cheatStrikes: finalCheatStrikes,
        }
      );
    }
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
