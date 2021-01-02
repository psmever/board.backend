"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
     * Add altering commands here.
     */
		await queryInterface.createTable("user_email_auth", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: "users", key: "id" }
			},
			verify_code: {
				type: Sequelize.STRING,
				allowNull: false,
            },
            verify_status: {
				type: Sequelize.STRING,
                allowNull: false,
                values: ["Y", "N"],
                defaultValue: 'N',
			},
			createdAt: {
				field: "createdAt",
				type: "TIMESTAMP",
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				field: "updatedAt",
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
		await queryInterface.dropTable("user_email_auth");
	}
};
