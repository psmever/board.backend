import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@src/instances/Sequelize';

interface UserNameChangeLogAttributes {
    id: number;
    user_id: number;
    before_name?: string | null;
    after_name?: string | null;
    createdAt?: string | null;
}

type UserNameChangeLogCreationAttributes = Optional<UserNameChangeLogAttributes, 'id'>;

class UserNameChangeLog extends Model<UserNameChangeLogAttributes, UserNameChangeLogCreationAttributes>
    implements UserNameChangeLogAttributes {
    public id!: number;
    public user_id!: number;
    public before_name!: string | null;
    public after_name!: string | null;
    public createdAt!: string | null;
}

UserNameChangeLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        before_name: {
            type: DataTypes.STRING,
        },
        after_name: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: 'TIMESTAMP',
        },
    },
    {
        tableName: 'user_name_change_log',
        timestamps: false,
        sequelize,
    }
);

export default UserNameChangeLog;
