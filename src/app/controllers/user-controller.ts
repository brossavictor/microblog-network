import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import { Response, Request } from 'express';

interface CreateBody {
  at: string;
  email: string;
  login: string;
  password: string;
  profilepic: string;
  username: string;
}

const userCollection = collection(db, 'users');

class UserController {
  async create(req: Request<any, any, CreateBody>, res: Response) {
    const { at, email, login, password, profilepic, username } = req.body;

    const checkMissingFields = (fields: Array<keyof CreateBody>) => {
      return !fields.every(field => req.body[field]);
    };

    const checkFieldsLength = (fields: Array<keyof CreateBody>) => {
      return fields.some(field => req.body[field].length < 5);
    };

    const { docs: emailDocs } = await getDocs(
      query(userCollection, where('email', '==', email)),
    );
    const isEmailRegistered = !!emailDocs.length;

    if (isEmailRegistered) {
      return res
        .status(400)
        .json({ error: 'This e-mail address is already registered.' });
    }

    const { docs: loginDocs } = await getDocs(
      query(userCollection, where('login', '==', login)),
    );
    const isLoginRegistered = !!loginDocs.length;

    if (isLoginRegistered) {
      return res
        .status(400)
        .json({ error: 'This login is already being used.' });
    }

    const { docs: atDocs } = await getDocs(
      query(userCollection, where('at', '==', at)),
    );
    const isAtRegistered = !!atDocs.length;

    if (isAtRegistered) {
      return res.status(400).json({ error: 'This @ has already been taken.' });
    }

    if (
      checkMissingFields([
        'at',
        'email',
        'login',
        'password',
        'profilepic',
        'username',
      ])
    ) {
      return res
        .status(400)
        .json({ error: 'One or more of the requisites is/are missing.' });
    }

    if (
      checkFieldsLength([
        'at',
        'email',
        'login',
        'password',
        'profilepic',
        'username',
      ])
    ) {
      return res.status(400).json({
        error: 'One or more of the fields has/have too few characters.',
      });
    }

    const { id } = await addDoc(userCollection, req.body);
    return res.status(201).json({ success: `User ${id} created.` });
  }

  async get(req: Request, res: Response) {
    const usersData = await getDocs(userCollection);
    const users = usersData.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    return res.json({ users });
  }
}

export const User = new UserController();
