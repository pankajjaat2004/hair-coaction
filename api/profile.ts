
import express, { Request, Response } from 'express';
const router = express.Router();

// Example: GET profile
router.get('/', (req: Request, res: Response) => {
  // Replace with real DB logic
  res.json({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '',
    bio: 'Hair enthusiast',
  });
});

// Example: POST update profile
router.post('/', (req: Request, res: Response) => {
  // Replace with real DB logic
  res.json({ success: true, ...req.body });
});

export default router;
