import express from 'express';
import { User } from './app/controllers/user-controller';

export const routes = express.Router();

routes.post('/users', User.create);

routes.get('/users', User.get);
