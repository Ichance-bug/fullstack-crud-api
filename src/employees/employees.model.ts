import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../_helpers/db';

export class Employee extends Model {
  declare employeeId: string;
  declare email:      string;
  declare position:   string;
  declare deptId:     string;
  declare hireDate:   string;
}

Employee.init(
  {
    employeeId: { type: DataTypes.STRING,  primaryKey: true },
    email:      { type: DataTypes.STRING,  allowNull: false },
    position:   { type: DataTypes.STRING,  allowNull: false },
    deptId:     { type: DataTypes.STRING,  allowNull: false },
    hireDate:   { type: DataTypes.DATEONLY, allowNull: false }
  },
  { sequelize, tableName: 'employees', timestamps: false }
);
