import express from 'express';
import { Session } from './app/controllers/session-controller';
import { User } from './app/controllers/user-controller';
import { auth } from './app/middlewares/auth';

export const routes = express.Router();

routes.post('/sessions', Session.create);

routes.post('/users', User.create);

routes.get('/users', User.get);

routes.put('/users/:userId', auth, User.update);

routes.delete('/users/:userId', auth, User.delete);
