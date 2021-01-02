"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */
		await queryInterface.createTable("users", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			user_uuid: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: ""
            },
            user_level: {
				type: Sequelize.STRING(6),
				allowNull: true,
				defaultValue: null
			},
            user_email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
			user_password: {
                type: Sequelize.STRING,
				allowNull: false,
			},
            user_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
			active: {
				type: Sequelize.ENUM,
				values: ["Y", "N"],
				allowNull: false,
				defaultValue: "Y"
			},
			profile_active: {
				type: Sequelize.ENUM,
				values: ["Y", "N"],
				allowNull: false,
				defaultValue: "N"
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
		}).then(() => queryInterface.addIndex("users", ["user_uuid", "user_level", "user_email"], {
			name: "user_uuid_level_email"
		})).then(() => queryInterface.addConstraint("users", {
			fields: ["user_level"],
			type: "foreign key",
			name: "custom_fkey_users_user_level",
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
		await queryInterface.dropTable("users");
	}
};
