"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

		await queryInterface.createTable("codes", {
			id: {
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			group_id: {
				type: Sequelize.STRING(3),
				allowNull: true,
				defaultValue: null,
			},
			code_id: {
				type: Sequelize.STRING(6),
				defaultValue: null,
				unique: true,
			},
			group_name: {
				type: Sequelize.STRING(100),
				allowNull: true,
				defaultValue: null
			},
			code_name: {
				type: Sequelize.STRING(100),
				allowNull: true,
				defaultValue: null
			},
			active: {
				type: Sequelize.ENUM,
				values: ["Y", "N"],
				allowNull: false,
				defaultValue: "Y"
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
		await queryInterface.dropTable("codes");
	}
};
