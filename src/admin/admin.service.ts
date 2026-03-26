import { User, safeUser, SafeUser } from '../users/user.model';
import { AppRequest } from '../requests/requests.model';
import * as userService from '../users/user.service';

export async function getAllAccounts(): Promise<SafeUser[]> {
  return (await User.findAll()).map(safeUser);
}

export async function createAccount(data: any): Promise<SafeUser> {
  return userService.create(data);
}

export async function updateAccount(id: string, data: any): Promise<SafeUser> {
  return userService.update(id, data);
}

export async function deleteAccount(id: string, requesterId: string): Promise<void> {
  return userService.remove(id, requesterId);
}

export async function resetPassword(id: string, password: string): Promise<void> {
  return userService.resetPassword(id, password);
}

export async function getAllRequests(): Promise<any[]> {
  const rows = await AppRequest.findAll();
  return rows.map(r => ({ ...r.toJSON(), items: JSON.parse(r.items) }));
}

export async function updateRequestStatus(id: string, status: string): Promise<any> {
  if (!['Pending', 'Approved', 'Rejected'].includes(status))
    throw Object.assign(new Error('Invalid status'), { status: 400 });
  const r = await AppRequest.findByPk(id);
  if (!r) throw Object.assign(new Error('Request not found'), { status: 404 });
  r.status = status;
  await r.save();
  return { ...r.toJSON(), items: JSON.parse(r.items) };
}
