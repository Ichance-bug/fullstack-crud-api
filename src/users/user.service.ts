import bcrypt from 'bcryptjs';
import { User, SafeUser, safeUser } from './user.model';
import { Role } from '../_helpers/role';

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function getAll(): Promise<SafeUser[]> {
  return (await User.findAll()).map(safeUser);
}

export async function getById(id: string): Promise<User> {
  const u = await User.findByPk(id);
  if (!u) throw Object.assign(new Error('User not found'), { status: 404 });
  return u;
}

export async function create(data: any): Promise<SafeUser> {
  const exists = await User.findOne({ where: { email: data.email.toLowerCase() } });
  if (exists) throw Object.assign(new Error('Email already exists'), { status: 409 });
  const hashed = await bcrypt.hash(data.password, 10);
  const u = await User.create({
    id: genId(), title: data.title ?? null,
    firstName: data.firstName, lastName: data.lastName,
    email: data.email.toLowerCase(), password: hashed,
    role: data.role || Role.User, isVerified: !!data.isVerified
  });
  return safeUser(u);
}

export async function update(id: string, data: any): Promise<SafeUser> {
  const u = await getById(id);
  if (data.firstName)  u.firstName  = data.firstName;
  if (data.lastName)   u.lastName   = data.lastName;
  if (data.email)      u.email      = data.email.toLowerCase();
  if (data.role)       u.role       = data.role;
  if (data.isVerified !== undefined) u.isVerified = data.isVerified;
  if (data.password && data.password.length >= 6)
    u.password = await bcrypt.hash(data.password, 10);
  await u.save();
  return safeUser(u);
}

export async function remove(id: string, requesterId: string): Promise<void> {
  const u = await getById(id);
  if (u.id === requesterId)
    throw Object.assign(new Error("You can't delete your own account"), { status: 403 });
  if (u.role === Role.Admin) {
    const adminCount = await User.count({ where: { role: Role.Admin } });
    if (adminCount <= 1)
      throw Object.assign(new Error('Cannot delete the last admin'), { status: 403 });
  }
  await u.destroy();
}

export async function resetPassword(id: string, password: string): Promise<void> {
  if (!password || password.length < 6)
    throw Object.assign(new Error('Password min 6 characters'), { status: 400 });
  const u = await getById(id);
  u.password = await bcrypt.hash(password, 10);
  await u.save();
}
