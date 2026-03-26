import { Employee } from './employees.model';
import { User } from '../users/user.model';

export async function getAll(): Promise<Employee[]> {
  return Employee.findAll();
}

export async function create(data: any): Promise<Employee> {
  const acc = await User.findOne({ where: { email: data.email?.toLowerCase() } });
  if (!acc) throw Object.assign(new Error('No user found with that email'), { status: 404 });
  return Employee.create({
    employeeId: data.employeeId,
    email:      data.email.toLowerCase(),
    position:   data.position,
    deptId:     data.deptId,
    hireDate:   data.hireDate
  });
}

export async function update(employeeId: string, data: any): Promise<Employee> {
  const emp = await Employee.findByPk(employeeId);
  if (!emp) throw Object.assign(new Error('Employee not found'), { status: 404 });
  await emp.update(data);
  return emp;
}

export async function remove(employeeId: string): Promise<void> {
  const emp = await Employee.findByPk(employeeId);
  if (!emp) throw Object.assign(new Error('Employee not found'), { status: 404 });
  await emp.destroy();
}
