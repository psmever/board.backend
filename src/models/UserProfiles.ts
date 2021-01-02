import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@src/instances/Sequelize';

interface UserProfilesAttributes {
    id: number;
    user_id: number;
    profile_intro?: string | null;
    profile_gender?: string | null;
}

type UserProfilesCreationAttributes = Optional<UserProfilesAttributes, 'id'>;

class UserProfiles extends Model<UserProfilesAttributes, UserProfilesCreationAttributes>
    implements UserProfilesAttributes {
    public id!: number;
    public user_id!: number;
    public profile_intro!: string | null;
    public profile_gender!: 'Y' | 'N';

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

UserProfiles.init(
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
        profile_intro: {
            type: DataTypes.TEXT,
        },
        profile_gender: {
            type: DataTypes.STRING(6),
            allowNull: true,
        },
    },
    {
        tableName: 'user_profile',
        sequelize,
    }
);

export default UserProfiles;
