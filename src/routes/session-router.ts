import { Router } from 'express';
import { Session } from '../app/controllers/session-controller';

export const sessionRoutes = Router();

sessionRoutes.post('/sessions', Session.create);
