const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/database');
const bcrypt = require('bcrypt');

const ALLOWED_ROLES = ['Admin', 'Client'];

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('password', bcrypt.hashSync(value, 10));
    }
  },
  role: {
    type: DataTypes.ENUM(ALLOWED_ROLES),
    allowNull: false,
    defaultValue: 'Client'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  deletedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  }
}, {
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['password', 'deletedAt']
    }
  },
  scopes: {
    withTrashed: {
      paranoid: false
    },
    withPassword: {
      attributes: {
        include: ['password']
      }
    }
  }
});

User.ALLOWED_ROLES = ALLOWED_ROLES;

module.exports = User;
