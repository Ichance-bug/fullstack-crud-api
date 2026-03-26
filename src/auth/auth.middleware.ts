import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const SECRET = 'jwt_secret_key_change_in_prod';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header) { res.status(401).json({ error: 'No token provided' }); return; }
  const token = header.split(' ')[1];
  try {
    (req as any).user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  if ((req as any).user?.role !== 'admin') {
    res.status(403).json({ error: 'Admins only' }); return;
  }
  next();
}
