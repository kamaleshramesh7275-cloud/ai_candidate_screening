import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const recruiterLogin = async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body;
  const expectedPassword = process.env.RECRUITER_PASSWORD || 'admin';
  const jwtSecret = process.env.JWT_SECRET || 'supersecretrecruiterjwttokenkey';

  if (password === expectedPassword) {
    const token = jwt.sign({ role: 'recruiter' }, jwtSecret, { expiresIn: '1d' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
};
