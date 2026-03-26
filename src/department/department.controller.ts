import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import * as service from './department.service';

const router = Router();

// GET /api/departments
router.get('/', authMiddleware, async (_req: Request, res: Response, next: NextFunction) => {
  try { res.json(await service.getAll()); }
  catch (e) { next(e); }
});

export default router;
