import bcrypt from 'bcryptjs';
import { User, safeUser, SafeUser } from '../users/user.model';
import { Role } from '../_helpers/role';

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function register(data: {
  firstName: string; lastName: string; email: string; password: string; title?: string;
}): Promise<{ message: string; email: string }> {
  const exists = await User.findOne({ where: { email: data.email.toLowerCase() } });
  if (exists) throw Object.assign(new Error('Email already registered'), { status: 409 });
  const hashed = await bcrypt.hash(data.password, 10);
  const u = await User.create({
    id: genId(), title: data.title ?? null,
    firstName: data.firstName, lastName: data.lastName,
    email: data.email.toLowerCase(), password: hashed,
    role: Role.User, isVerified: false
  });
  return { message: 'Registered. Please verify your email.', email: u.email };
}

export async function verify(email: string): Promise<void> {
  const u = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!u) throw Object.assign(new Error('User not found'), { status: 404 });
  u.isVerified = true;
  await u.save();
}

export async function login(email: string, password: string): Promise<User> {
  const u = await User.findOne({ where: { email: email.toLowerCase(), isVerified: true } });
  if (!u) throw Object.assign(new Error('Invalid credentials or account not verified'), { status: 401 });
  const match = await bcrypt.compare(password, u.password);
  if (!match) throw Object.assign(new Error('Invalid credentials or account not verified'), { status: 401 });
  return u;
}

export async function getProfile(id: string): Promise<SafeUser> {
  const u = await User.findByPk(id);
  if (!u) throw Object.assign(new Error('User not found'), { status: 404 });
  return safeUser(u);
}
