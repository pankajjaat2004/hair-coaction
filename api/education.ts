import express, { Request, Response } from 'express';
const router = express.Router();

// Example: GET all education resources
router.get('/', (req: Request, res: Response) => {
  res.json([
    { id: 1, title: 'Hair Growth Science', type: 'blog' },
    { id: 2, title: 'Hair Loss Treatments', type: 'video' },
  ]);
});

// Example: POST add education resource
router.post('/', (req: Request, res: Response) => {
  res.json({ success: true, ...req.body });
});

export default router;
