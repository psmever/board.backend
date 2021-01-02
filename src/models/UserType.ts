import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@src/instances/Sequelize';

interface UserTypeAttributes {
    id: number;
    user_id: number;
    user_type: string | null;
}

type UserTypeCreationAttributes = Optional<UserTypeAttributes, 'id'>;

class UserType extends Model<UserTypeAttributes, UserTypeCreationAttributes> implements UserTypeAttributes {
    public id!: number;
    public user_id!: number;
    public user_type!: string | null;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

UserType.init(
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
            defaultValue: '',
        },
        user_type: {
            type: DataTypes.STRING(6),
            allowNull: false,
        },
    },
    {
        tableName: 'user_type',
        sequelize,
    }
);

export default UserType;
