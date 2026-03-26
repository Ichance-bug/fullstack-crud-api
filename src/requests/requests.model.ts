import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../_helpers/db';

export class AppRequest extends Model {
  declare id:            string;
  declare type:          string;
  declare items:         string;
  declare status:        string;
  declare date:          string;
  declare userId:        string;
}

AppRequest.init(
  {
    id:     { type: DataTypes.STRING, primaryKey: true },
    type:   { type: DataTypes.STRING, allowNull: false },
    items:  { type: DataTypes.TEXT,   allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    date:   { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false }
  },
  { sequelize, tableName: 'requests', timestamps: false }
);
