import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware, adminMiddleware } from '../auth/auth.middleware';
import * as service from './employees.service';

const router = Router();

// GET /api/employees
router.get('/', authMiddleware, adminMiddleware,
  async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.getAll()); }
    catch (e) { next(e); }
  }
);

// POST /api/employees
router.post('/', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await service.create(req.body)); }
    catch (e) { next(e); }
  }
);

// PUT /api/employees/:employeeId
router.put('/:employeeId', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await service.update(req.params.employeeId, req.body)); }
    catch (e) { next(e); }
  }
);

// DELETE /api/employees/:employeeId
router.delete('/:employeeId', authMiddleware, adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await service.remove(req.params.employeeId);
      res.json({ message: 'Employee deleted' });
    } catch (e) { next(e); }
  }
);

export default router;
