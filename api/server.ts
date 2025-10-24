import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import profileRouter from './profile';
import eventRouter from './event';
import educationRouter from './education';
import consultationRouter from './consultation';
import communityRouter from './community';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/profile', profileRouter);
app.use('/api/event', eventRouter);
app.use('/api/education', educationRouter);
app.use('/api/consultation', consultationRouter);
app.use('/api/community', communityRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hair-Coaction API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
