import express, { Request, Response } from 'express';
const router = express.Router();

// Example: GET all consultations
router.get('/', (req: Request, res: Response) => {
  res.json([
    { id: 1, user: 'John Doe', topic: 'Hair Loss', status: 'pending' },
    { id: 2, user: 'Jane Smith', topic: 'Scalp Health', status: 'completed' },
  ]);
});

// Example: POST create consultation
router.post('/', (req: Request, res: Response) => {
  res.json({ success: true, ...req.body });
});

export default router;
