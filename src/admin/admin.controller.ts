import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { authMiddleware, adminMiddleware } from '../auth/auth.middleware';
import * as service from './admin.service';

const router = Router();

// ─── Accounts ─────────────────────────────────────────────────────────────────
router.get('/accounts', authMiddleware, adminMiddleware,
  async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.getAllAccounts()); }
    catch (e) { next(e); }
  }
);

router.post('/accounts', authMiddleware, adminMiddleware,
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
    try { res.status(201).json(await service.createAccount(req.body)); }
    catch (e) { next(e); }
  }
);

router.put('/accounts/:id', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.updateAccount(req.params.id, req.body)); }
    catch (e) { next(e); }
  }
);

router.delete('/accounts/:id', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await service.deleteAccount(req.params.id, (req as any).user.id);
      res.json({ message: 'Account deleted' });
    } catch (e) { next(e); }
  }
);

router.post('/accounts/:id/reset-password', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await service.resetPassword(req.params.id, req.body.password);
      res.json({ message: 'Password reset' });
    } catch (e) { next(e); }
  }
);

// ─── Requests ─────────────────────────────────────────────────────────────────
router.get('/requests', authMiddleware, adminMiddleware,
  async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.getAllRequests()); }
    catch (e) { next(e); }
  }
);

router.put('/requests/:id/status', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.updateRequestStatus(req.params.id, req.body.status)); }
    catch (e) { next(e); }
  }
);

export default router;
