const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/database');
const Product = require('./Product');
const ProductPurchase = require('./ProductPurchase');
const User = require('./User');

const Purchase = sequelize.define('Purchase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  deletedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  }
}, {
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt']
    }
  },
  scopes: {
    withTrashed: {
      paranoid: false
    }
  }
});

Purchase.belongsToMany(Product, { through: ProductPurchase });
Purchase.belongsTo(User, { foreignKey: 'userId' });

module.exports = Purchase;
