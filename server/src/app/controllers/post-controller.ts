import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  documentId,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import { Response, Request } from 'express';
import {
  userCollection,
  UserCreateBody,
  getLoggedUserReference,
} from './user-controller';

export type PostCreateBody = {
  image: string;
  text: string;
};
export const postCollection = collection(db, 'posts');

class PostController {
  async create(req: Request<any, any, PostCreateBody>, res: Response) {
    const post = { ...req.body, author: getLoggedUserReference(res) };

    await addDoc(postCollection, post);

    return res.status(201).json({ success: true });
  }

  async getOwnFeed(req: Request<any, any, PostCreateBody>, res: Response) {
    const { docs } = await getDocs(
      query(postCollection, where('author', '==', getLoggedUserReference(res))),
    );

    const posts = docs.map(doc => ({ ...doc.data(), id: doc.id }));

    return res.json({ posts });
  }

  async getFeed(req: Request<any, any, UserCreateBody>, res: Response) {
    const { docs: userDocs } = await getDocs(
      query(userCollection, where(documentId(), '==', res.locals.userId)),
    );

    const [{ following }] = userDocs.map(doc => doc.data()) as UserCreateBody[];

    const { docs: postsDocs } = await getDocs(
      query(postCollection, where('author', 'in', following)),
    );

    const posts = postsDocs.map(doc => ({ ...doc.data(), id: doc.id }));

    return res.json({ posts });
  }

  async delete(req: Request, res: Response) {
    if (!req.params.postId) {
      return res.status(401).json({ error: 'Unauthorized request.' });
    }

    const {
      docs: [post],
    } = await getDocs(
      query(
        postCollection,
        where('author', '==', getLoggedUserReference(res)),
        where(documentId(), '==', req.params.postId),
      ),
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const document = doc(db, `posts/${post.id}`);
    await deleteDoc(document);

    return res.status(202).json({ success: 'Post deleted.' });
  }
}

export const Post = new PostController();
