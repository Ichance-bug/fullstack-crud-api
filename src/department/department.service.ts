import { Department } from './department.model';

export async function getAll(): Promise<Department[]> {
  return Department.findAll();
}

export async function getById(id: string): Promise<Department> {
  const d = await Department.findByPk(id);
  if (!d) throw Object.assign(new Error('Department not found'), { status: 404 });
  return d;
}
