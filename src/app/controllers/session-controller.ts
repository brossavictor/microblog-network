import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Response, Request } from 'express';
import { userCollection, UserCreateBody } from './user-controller';
import { sign } from 'jsonwebtoken';

type User = UserCreateBody;

type SessionCreateBody = Pick<User, 'login' | 'password'>;

class SessionController {
  async create(req: Request<any, any, SessionCreateBody>, res: Response) {
    const { login, password } = req.body;

    const { docs } = await getDocs(
      query(userCollection, where('login', '==', login)),
    );

    if (!docs.length) {
      return res.status(401).json({ error: 'User does not exist.' });
    }

    const [userDoc] = docs;
    const user = { ...(userDoc.data() as User), id: userDoc.id };
    if (password !== user.password) {
      return res.status(401).json({ error: 'Credentials do not match.' });
    }

    return res.json({
      user,
      token: sign({ id: user.id }, '8b6862ca34aa28736f6604dfa1034d52'),
    });
  }
}

export const Session = new SessionController();
