import { AppRequest } from './requests.model';

export async function getByUser(userId: string): Promise<any[]> {
  const rows = await AppRequest.findAll({ where: { userId } });
  return rows.map(r => ({ ...r.toJSON(), items: JSON.parse(r.items) }));
}

export async function getAll(): Promise<any[]> {
  const rows = await AppRequest.findAll();
  return rows.map(r => ({ ...r.toJSON(), items: JSON.parse(r.items) }));
}

export async function create(userId: string, type: string, items: any[]): Promise<any> {
  if (!type || !items?.length)
    throw Object.assign(new Error('Type and items required'), { status: 400 });
  const r = await AppRequest.create({
    id:     Date.now().toString(36),
    type,
    items:  JSON.stringify(items),
    status: 'Pending',
    date:   new Date().toLocaleDateString(),
    userId
  });
  return { ...r.toJSON(), items };
}

export async function updateStatus(id: string, status: string): Promise<any> {
  if (!['Pending', 'Approved', 'Rejected'].includes(status))
    throw Object.assign(new Error('Invalid status'), { status: 400 });
  const r = await AppRequest.findByPk(id);
  if (!r) throw Object.assign(new Error('Request not found'), { status: 404 });
  r.status = status;
  await r.save();
  return { ...r.toJSON(), items: JSON.parse(r.items) };
}
