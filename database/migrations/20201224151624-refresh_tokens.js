'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('refresh_tokens', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        access_token_id: {
            type: Sequelize.STRING,
        },
        revoked: {
            type: Sequelize.ENUM,
            values: ["Y", "N"],
            defaultValue: "N"
        },
        expiresAt: {
            field: "expiresAt",
            type: "TIMESTAMP",
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable("refresh_tokens");
  }
};
