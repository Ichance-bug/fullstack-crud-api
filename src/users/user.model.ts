import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../_helpers/db';
import { Role } from '../_helpers/role';

interface UserAttributes {
  id:         string;
  title?:     string | null;
  firstName:  string;
  lastName:   string;
  email:      string;
  password:   string;
  role:       Role;
  isVerified: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id:         string;
  declare title?:     string | null;
  declare firstName:  string;
  declare lastName:   string;
  declare email:      string;
  declare password:   string;
  declare role:       Role;
  declare isVerified: boolean;
}

User.init(
  {
    id:         { type: DataTypes.STRING,  primaryKey: true },
    title:      { type: DataTypes.STRING,  allowNull: true },
    firstName:  { type: DataTypes.STRING,  allowNull: false },
    lastName:   { type: DataTypes.STRING,  allowNull: false },
    email:      { type: DataTypes.STRING,  allowNull: false, unique: true },
    password:   { type: DataTypes.STRING,  allowNull: false },
    role:       { type: DataTypes.ENUM(...Object.values(Role)), defaultValue: Role.User },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  { sequelize, tableName: 'users', timestamps: true }
);

export type SafeUser = Omit<UserAttributes, 'password'>;

export function safeUser(u: User): SafeUser {
  const { password, ...rest } = u.toJSON() as UserAttributes;
  return rest;
}
