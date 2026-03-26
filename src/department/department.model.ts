import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../_helpers/db';

export class Department extends Model {
  declare id:          string;
  declare name:        string;
  declare description: string;
}

Department.init(
  {
    id:          { type: DataTypes.STRING, primaryKey: true },
    name:        { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true }
  },
  { sequelize, tableName: 'departments', timestamps: false }
);
