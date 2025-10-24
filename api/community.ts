import express, { Request, Response } from 'express';
const router = express.Router();

// Example: GET all community posts
router.get('/', (req: Request, res: Response) => {
  res.json([
    { id: 1, author: 'John Doe', content: 'Welcome to the hair community!' },
    { id: 2, author: 'Jane Smith', content: 'Tips for healthy hair.' },
  ]);
});

// Example: POST create community post
router.post('/', (req: Request, res: Response) => {
  res.json({ success: true, ...req.body });
});

export default router;
