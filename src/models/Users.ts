import { Model, DataTypes, Optional, HasOneGetAssociationMixin, Association } from 'sequelize';
import { sequelize } from '@src/instances/Sequelize';
import Codes from '@src/models/Codes';
import UserProfiles from '@src/models/UserProfiles';

interface UsersAttributes {
    id: number;
    user_uuid: string;
    user_name: string | null;
    user_password: string | null;
    user_email: string | null;
    user_level: string | null;
    active: 'Y' | 'N';
    profile_active: 'Y' | 'N';
}

type UsersCreationAttributes = Optional<UsersAttributes, 'id'>;

class Users extends Model<UsersAttributes, UsersCreationAttributes> implements UsersAttributes {
    public id!: number;
    public user_uuid!: string;
    public user_level!: string;
    public user_name!: string | null;
    public user_password!: string | null;
    public user_email!: string | null;
    public active!: 'Y' | 'N';
    public profile_active!: 'Y' | 'N';

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUserLevel!: HasOneGetAssociationMixin<Codes>;
    public getUserProfile!: HasOneGetAssociationMixin<UserProfiles>;

    public readonly userLevel?: Codes;
    public readonly userProfile?: UserProfiles;

    public static associations: {
        userLevel: Association<Users, Codes>;
        userProfile: Association<Users, UserProfiles>;
    };
}

Users.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_uuid: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        user_level: {
            type: DataTypes.STRING(6),
            allowNull: false,
            defaultValue: '',
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        active: {
            type: DataTypes.ENUM,
            values: ['Y', 'N'],
            allowNull: false,
            defaultValue: 'Y',
        },
        profile_active: {
            type: DataTypes.ENUM,
            values: ['Y', 'N'],
            allowNull: false,
            defaultValue: 'N',
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

Users.hasOne(Codes, {
    sourceKey: 'user_level',
    foreignKey: 'code_id',
    as: 'userLevel',
});

Users.hasOne(UserProfiles, {
    sourceKey: 'id',
    foreignKey: 'user_id',
    as: 'userProfile',
});

export default Users;
