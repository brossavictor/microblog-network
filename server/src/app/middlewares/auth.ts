import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export async function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not found.' });
  }
  const [, token] = authHeader.split(' ');
  try {
    const { id } = verify(token, '8b6862ca34aa28736f6604dfa1034d52') as {
      id: string;
    };

    res.locals.userId = id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
}
