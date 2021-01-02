'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("user_name_change_log", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        before_name: {
            type: Sequelize.STRING,
        },
        after_name: {
            type: Sequelize.STRING,
        },
        createdAt: {
            field: "createdAt",
            type: "TIMESTAMP",
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("user_name_change_log");
  }
};
