import { Router } from 'express';
import { Post } from '../app/controllers/post-controller';
import { auth } from '../app/middlewares/auth';

export const postRoutes = Router();

postRoutes.post('/posts', auth, Post.create);

postRoutes.get('/posts/getownfeed', auth, Post.getOwnFeed);
postRoutes.get('/posts/getfeed', auth, Post.getFeed);

postRoutes.delete('/posts/:postId', auth, Post.delete);
