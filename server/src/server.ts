import cors from 'cors';
import express from 'express';
import { userRoutes, postRoutes, sessionRoutes } from './routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use(userRoutes);
app.use(postRoutes);
app.use(sessionRoutes);

app.listen(process.env.PORT || 3333, () => {
  console.log('HTTPS server running!');
});
