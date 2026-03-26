import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { authMiddleware, adminMiddleware } from '../auth/auth.middleware';
import * as service from './user.service';

const router = Router();

// GET /api/users
router.get('/', authMiddleware, adminMiddleware,
  async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.getAll()); }
    catch (e) { next(e); }
  }
);

// POST /api/users
router.post('/', authMiddleware, adminMiddleware,
  validateRequest(Joi.object({
    title:      Joi.string().allow(null, ''),
    firstName:  Joi.string().required(),
    lastName:   Joi.string().required(),
    email:      Joi.string().email().required(),
    password:   Joi.string().min(6).required(),
    role:       Joi.string().valid('user', 'admin'),
    isVerified: Joi.boolean()
  })),
  async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await service.create(req.body)); }
    catch (e) { next(e); }
  }
);

// PUT /api/users/:id
router.put('/:id', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.update(req.params.id, req.body)); }
    catch (e) { next(e); }
  }
);

// DELETE /api/users/:id
router.delete('/:id', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await service.remove(req.params.id, (req as any).user.id);
      res.json({ message: 'User deleted' });
    } catch (e) { next(e); }
  }
);

// POST /api/users/:id/reset-password
router.post('/:id/reset-password', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await service.resetPassword(req.params.id, req.body.password);
      res.json({ message: 'Password reset' });
    } catch (e) { next(e); }
  }
);

export default router;
