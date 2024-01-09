require('dotenv').config();

module.exports = {
  mysql: {
    dialect: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_DATABASE || 'database',
    username: process.env.DB_USERNAME || 'username',
    password: process.env.DB_PASSWORD || '',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  pgsql: {
    dialect: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || 'database',
    username: process.env.DB_USERNAME || 'username',
    password: process.env.DB_PASSWORD || '',
    dialectOptions: {
      bigNumberStrings: true
    }
  }
};