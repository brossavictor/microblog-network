import { User } from '../app/controllers/user-controller';
import { auth } from '../app/middlewares/auth';
import { Router } from 'express';

export const userRoutes = Router();

userRoutes.post('/users', User.create);

userRoutes.get('/users', User.get);
userRoutes.get('/users/followers', auth, User.getMyFollowers);
userRoutes.get('/users/following', auth, User.getWhoImFollowing);

userRoutes.put('/users/:userId', auth, User.update);

userRoutes.delete('/users/:userId', auth, User.delete);
