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
import { db } from '../../config/firebaseconfig';
import { Response, Request } from 'express';

export type UserCreateBody = {
  at: string;
  email: string;
  followers: Array<any>;
  following: Array<any>;
  login: string;
  password: string;
  profilepic: string;
  username: string;
};

export const getLoggedUserReference = (res: Response) =>
  doc(db, `users/${res.locals.userId}`);

type ValidateBodyParams = {
  body: UserCreateBody;
  res: Response;
  isCreation?: boolean;
};
export const userCollection = collection(db, 'users');

const validateBody = async ({
  body,
  res,
  isCreation = true,
}: ValidateBodyParams) => {
  const { at, email, login, password, profilepic, username } = body;

  const checkMissingFields = (fields: Array<keyof UserCreateBody>) => {
    return !fields.every(field => body[field]);
  };

  const checkFieldsLength = (fields: Array<keyof UserCreateBody>) => {
    return fields.some(field => body[field].length < 5);
  };

  const { docs: emailDocs } = await getDocs(
    query(userCollection, where('email', '==', email)),
  );

  console.log(emailDocs);

  const isEmailRegistered = !!emailDocs.length;

  if (isCreation && isEmailRegistered) {
    return res
      .status(400)
      .json({ error: 'This e-mail address is already registered.' });
  }

  const { docs: loginDocs } = await getDocs(
    query(userCollection, where('login', '==', login)),
  );
  const loginsFound = loginDocs.length;

  const loginAlreadyExistsOnUserCreation = isCreation && loginsFound;
  const hasMoreThanOneLoginFound = loginsFound > 1;
  const loginValidationFailed =
    loginAlreadyExistsOnUserCreation || hasMoreThanOneLoginFound;
  if (loginValidationFailed) {
    return res.status(400).json({ error: 'This login is already being used.' });
  }

  const { docs: atDocs } = await getDocs(
    query(userCollection, where('at', '==', at)),
  );
  const atsFound = atDocs.length;

  const atAlreadyExistsOnUserCreation = isCreation && loginsFound;
  const hasMoreThanOneAtFound = atsFound > 1;
  const atValidationFailed =
    atAlreadyExistsOnUserCreation || hasMoreThanOneAtFound;
  if (atValidationFailed) {
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
};

export class UserController {
  async create(req: Request<any, any, UserCreateBody>, res: Response) {
    const hasError = await validateBody({ body: req.body, res });
    if (hasError) {
      return hasError;
    }
    const { id } = await addDoc(userCollection, req.body);
    return res.status(201).json({ success: `User ${id} created.` });
  }

  async get(req: Request, res: Response) {
    const usersData = await getDocs(userCollection);
    const users = usersData.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    return res.json({ users });
  }

  async update(req: Request<any, any, UserCreateBody>, res: Response) {
    const hasError = await validateBody({
      body: req.body,
      res,
      isCreation: false,
    });

    if (hasError) {
      return hasError;
    }

    const userDoc = doc(db, 'users', req.params.userId);
    await updateDoc(userDoc, req.body);
    return res
      .status(202)
      .json({ success: `User ${req.params.userId} updated.` });
  }

  async delete(req: Request, res: Response) {
    const loggedUserId = res.locals.userId;
    const deleteUserId = req.params.id;
    if (loggedUserId !== deleteUserId) {
      return res.status(401).json({ error: 'Unauthorized request.' });
    }
    const document = doc(db, `users/${req.params.id}`);
    await deleteDoc(document);
    return res.status(202).json({ success: 'Account deleted.' });
  }

  async getMyFollowers(req: Request<any, any, UserCreateBody>, res: Response) {
    const { docs: followersDocs } = await getDocs(
      query(
        userCollection,
        where(
          'following',
          'array-contains',
          doc(db, `users/${res.locals.userId}`),
        ),
      ),
    );

    const followed = followersDocs.map(doc => ({ ...doc.data(), id: doc.id }));

    return res.json({ followed });
  }

  async getWhoImFollowing(
    req: Request<any, any, UserCreateBody>,
    res: Response,
  ) {
    const { docs: followingDocs } = await getDocs(
      query(
        userCollection,
        where(
          'followers',
          'array-contains',
          doc(db, `users/${res.locals.userId}`),
        ),
      ),
    );

    const following = followingDocs.map(doc => ({ ...doc.data(), id: doc.id }));

    return res.json({ following });
  }
}

export const User = new UserController();
