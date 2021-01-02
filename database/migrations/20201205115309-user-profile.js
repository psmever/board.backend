"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
		await queryInterface.createTable("user_profile", {
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
			profile_name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			profile_bio: {
				type: Sequelize.TEXT,
			},
			profile_gender: {
				type: Sequelize.STRING(6),
				allowNull: true
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
		}).then(() => queryInterface.addIndex("user_profile", ["user_id", "profile_gender"], {
			name: "user_id_gender"
		})).then(() => queryInterface.addConstraint("user_profile", {
			fields: ["user_id"],
			type: "foreign key",
			name: "custom_fkey_user_profile_user_id",
			references: {
				table: "users",
				field: "id"
			},
			onDelete: "cascade",
			onUpdate: "cascade"
		})).then(() => queryInterface.addConstraint("user_profile", {
			fields: ["profile_gender"],
			type: "foreign key",
			name: "custom_fkey_user_profile_gender",
			references: {
				table: "codes",
				field: "code_id"
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
		await queryInterface.dropTable("user_profile");
	}
};
