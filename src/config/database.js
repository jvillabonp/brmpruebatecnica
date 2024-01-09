const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE || 'mysql',
  username: process.env.DB_USERNAME || 'username',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: process.env.DB_CONNECTION || 'mysql',
});

module.exports = sequelize;
