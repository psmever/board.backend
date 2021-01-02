'use strict';

const codes = require('../seeditems/codes-seed');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   var options = { raw: true };
   await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0").then(function () {
       return queryInterface.sequelize.query("truncate table codes", null, options);
   }).then(function () {
       return queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null, options);
   });

   await queryInterface.bulkInsert("codes", codes, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('codes', null, {});
  }
};
