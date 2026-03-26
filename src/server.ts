import express from 'express';
import cors from 'cors';
import path from 'path';
import { initDb } from './_helpers/db';
import { seedAdmin, seedDepartments } from './_helpers/seed';
import { errorHandler } from './_middleware/errorHandler';
import authRoutes       from './auth/auth.controller';
import userRoutes       from './users/user.controller';
import adminRoutes      from './admin/admin.controller';
import departmentRoutes from './department/department.controller';
import employeeRoutes   from './employees/employees.controller';
import requestRoutes    from './requests/requests.controller';

const app  = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api',              authRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/departments',  departmentRoutes);
app.use('/api/employees',    employeeRoutes);
app.use('/api/requests',     requestRoutes);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await initDb();
    await seedAdmin();
    await seedDepartments();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
