import express, { Request, Response } from 'express';
const router = express.Router();

// Example: GET all events
router.get('/', (req: Request, res: Response) => {
  res.json([
    { id: 1, title: 'Hair Health Webinar', date: '2025-09-10', location: 'Online' },
    { id: 2, title: 'Community Meetup', date: '2025-09-20', location: 'Salon XYZ' },
  ]);
});

// Example: POST create event
router.post('/', (req: Request, res: Response) => {
  res.json({ success: true, ...req.body });
});

export default router;
