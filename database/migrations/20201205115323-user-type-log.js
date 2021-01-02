"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
		await queryInterface.createTable("user_type", {
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
			user_type: {
				type: Sequelize.STRING(6),
				allowNull: false,
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
		}).then(() => queryInterface.addIndex("user_type", ["user_id", "user_type"], {
			name: "user_id_type"
		})).then(() => queryInterface.addConstraint("user_type", {
			fields: ["user_id"],
			type: "foreign key",
			name: "custom_fkey_user_type_user_id",
			references: {
				table: "users",
				field: "id"
			},
			onDelete: "cascade",
			onUpdate: "cascade"
		}));
	},

	down: async (queryInterface, Sequelize) => {
		/**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
		await queryInterface.dropTable("user_type");
	}
};
