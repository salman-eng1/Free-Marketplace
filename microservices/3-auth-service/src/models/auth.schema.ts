import { sequelize } from '@auth/database';
import { IAuthDocument } from '@salman-eng1/marketplace-shared';
import { compare, hash } from 'bcrypt';
import { DataTypes, Model, ModelDefined, Optional } from 'sequelize';
import { ModuleTypeOverride, ModuleTypes } from 'ts-node';

const SALT_ROUND = 10;

type AuthUserCreationAttributes = Optional<IAuthDocument, 'id' | 'createdAt' | 'passwordResetToken' | 'passwordResetExpires'>;

const AuthModel: ModelDefined<IAuthDocument, AuthUserCreationAttributes> = sequelize.define('auths', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePublicId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emailVerificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now
  },
  passwordResetToken: { type: DataTypes.STRING, allowNull: true },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['emailVerificationToken']
    },
  ]
});

//it will trigger event to execute the function below once a new document is going to be  created
AuthModel.addHook('beforeCreate', async (auth: Model) => {
  const hashedPassword: string = await hash(auth.dataValues.password as string, SALT_ROUND);
  auth.dataValues.password = hashedPassword;
});

AuthModel.prototype.dataValues.comparePassword = async function (password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
};

AuthModel.prototype.dataValues.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};

// force: true always deletes the table when there is a server restart
AuthModel.sync({});
export { AuthModel };