import { Request, Response } from 'express';
import { prisma } from '../index';
import questionsDb from '../questions.json';

export const generateTest = async (req: Request, res: Response) => {
  try {
    const { domain } = req.params;
    const { candidateId } = req.query;
    
    const allQuestions = (questionsDb as Record<string, any[]>)[domain as string] || (questionsDb as Record<string, any[]>)['General CS'];
    
    // Send questions without answers to the client
    const testQuestions = allQuestions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));

    // Randomize order
    testQuestions.sort(() => Math.random() - 0.5);

    // If candidateId is provided, record the start time in DB
    if (candidateId) {
      await prisma.candidate.update({
        where: { id: candidateId as string },
        data: { testStartTime: new Date() }
      }).catch(err => console.error('Error updating candidate testStartTime:', err));
    }

    res.status(200).json({ questions: testQuestions });
  } catch (error) {
    console.error('Error generating test:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const submitTest = async (req: Request, res: Response) => {
  try {
    const { candidateId, answers, cheatStrikes, cheatLog } = req.body;

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    if (candidate.testCompleted) {
      return res.status(400).json({ error: 'Test already completed.' });
    }

    const domain = candidate.domain || 'General CS';
    const allQuestions = (questionsDb as Record<string, any[]>)[domain as string] || (questionsDb as Record<string, any[]>)['General CS'];
    
    // Server-side test duration validation
    let timerFlagged = false;
    let finalCheatStrikes = cheatStrikes;
    const updatedCheatLog = [...(cheatLog || [])];

    if (candidate.testStartTime) {
      const startTime = new Date(candidate.testStartTime).getTime();
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      // Allow 60 seconds per question + a generous 60-second overall buffer for network latency/loading
      const maxAllowedSeconds = (allQuestions.length * 60) + 60;

      if (elapsedSeconds > maxAllowedSeconds) {
        timerFlagged = true;
        finalCheatStrikes = Math.min(3, finalCheatStrikes + 2); // Add heavy strikes for time manipulation
        updatedCheatLog.push({
          type: 'Server-side Time Limit Exceeded',
          timestamp: new Date().toISOString(),
          details: `Elapsed: ${Math.round(elapsedSeconds)}s, Max Allowed: ${maxAllowedSeconds}s`
        });
      }
    }

    let correctCount = 0;
    
    // Score answers
    Object.keys(answers).forEach(questionId => {
      const q = allQuestions.find((q: any) => q.id === questionId);
      if (q && q.answer === answers[questionId]) {
        correctCount++;
      }
    });

    // Calculate Test Score: (correct / total * 100) - (strikes * 5)
    let testScore = (correctCount / allQuestions.length) * 100;
    testScore -= (finalCheatStrikes * 5);
    testScore = Math.max(testScore, 0); // floor at 0

    // Weighted average (Resume 25% + GitHub 25% + Test 50%)
    const overallScore = ((candidate.resumeScore || 0) * 0.25) + ((candidate.githubScore || 0) * 0.25) + (testScore * 0.50);

    await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        testCompleted: true,
        testScore,
        cheatStrikes: finalCheatStrikes,
        cheatLog: JSON.stringify(updatedCheatLog),
        overallScore,
        status: 'Tested'
      }
    });

    res.status(200).json({ message: 'Test submitted successfully', testScore, overallScore, timerFlagged });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
