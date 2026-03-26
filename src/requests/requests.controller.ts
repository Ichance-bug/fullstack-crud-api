import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware, adminMiddleware } from '../auth/auth.middleware';
import * as service from './requests.service';

const router = Router();

// GET /api/requests — user's own requests
router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await service.getByUser((req as any).user.id)); }
  catch (e) { next(e); }
});

// POST /api/requests
router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, items } = req.body;
    res.status(201).json(await service.create((req as any).user.id, type, items));
  } catch (e) { next(e); }
});

// GET /api/requests/all — admin only
router.get('/all', authMiddleware, adminMiddleware,
  async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.getAll()); }
    catch (e) { next(e); }
  }
);

// PUT /api/requests/:id/status — admin only
router.put('/:id/status', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.updateStatus(req.params.id, req.body.status)); }
    catch (e) { next(e); }
  }
);

export default router;
