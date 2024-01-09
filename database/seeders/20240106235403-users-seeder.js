'use strict';

const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return User.bulkCreate([
      {
        username: 'admin',
        email: 'admin@brm.com.co',
        password: '123456',
        role: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'client',
        email: 'client@brm.com.co',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
