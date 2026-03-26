import bcrypt from 'bcryptjs';
import { User } from '../users/user.model';
import { Department } from '../department/department.model';
import { Role } from './role';

export async function seedAdmin(): Promise<void> {
  const exists = await User.findOne({ where: { email: 'admin@example.com' } });
  if (exists) return;
  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({
    id: 'seed-admin-1', title: null,
    firstName: 'Admin', lastName: 'User',
    email: 'admin@example.com', password: hashed,
    role: Role.Admin, isVerified: true
  });
  console.log('Admin seeded.');
}

export async function seedDepartments(): Promise<void> {
  const count = await Department.count();
  if (count > 0) return;
  await Department.bulkCreate([
    { id: 'd1', name: 'Engineering', description: 'Software & hardware engineering' },
    { id: 'd2', name: 'HR',          description: 'Human resources' }
  ]);
  console.log('Departments seeded.');
}
