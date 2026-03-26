import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { authMiddleware, SECRET } from './auth.middleware';
import { safeUser } from '../users/user.model';
import * as service from './auth.service';

const router = Router();

// POST /api/register
router.post('/register',
  validateRequest(Joi.object({
    title:     Joi.string().allow(null, ''),
    firstName: Joi.string().required(),
    lastName:  Joi.string().required(),
    email:     Joi.string().email().required(),
    password:  Joi.string().min(6).required()
  })),
  async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await service.register(req.body)); }
    catch (e) { next(e); }
  }
);

// POST /api/verify
router.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.verify(req.body.email);
    res.json({ message: 'Email verified.' });
  } catch (e) { next(e); }
});

// POST /api/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const u = await service.login(req.body.email, req.body.password);
    const token = jwt.sign(
      { id: u.id, email: u.email, role: u.role, firstName: u.firstName, lastName: u.lastName },
      SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, user: safeUser(u) });
  } catch (e) { next(e); }
});

// GET /api/profile
router.get('/profile', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await service.getProfile((req as any).user.id)); }
  catch (e) { next(e); }
});

export default router;
