import { Model, DataTypes, Optional, HasOneGetAssociationMixin, Association } from 'sequelize';
import { sequelize } from '@src/instances/Sequelize';
import Users from '@src/models/Users';

interface UserEmailAuthAttributes {
    id: number;
    user_id: number;
    verify_code: string | null;
    verify_status: 'Y' | 'N';
}

type UserEmailAuthCreationAttributes = Optional<UserEmailAuthAttributes, 'id'>;

class UserEmailAuth extends Model<UserEmailAuthAttributes, UserEmailAuthCreationAttributes>
    implements UserEmailAuthAttributes {
    public id!: number;
    public user_id!: number;
    public verify_code!: string | null;
    public verify_status!: 'Y' | 'N';

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // // Since TS cannot determine model association at compile time
    // // we have to declare them here purely virtually
    // // these will not exist until `Model.init` was called.
    public getUser!: HasOneGetAssociationMixin<Users>; // Note the null assertions!
    // public addProject!: HasManyAddAssociationMixin<Project, number>;
    // public hasProject!: HasManyHasAssociationMixin<Project, number>;
    // public countProjects!: HasManyCountAssociationsMixin;
    // public createProject!: HasManyCreateAssociationMixin<Project>;

    // // You can also pre-declare possible inclusions, these will only be populated if you
    // // actively include a relation.
    public readonly user?: Users; // Note this is optional since it's only populated when explicitly requested in code

    public static associations: {
        user: Association<UserEmailAuth, Users>;
    };
}

UserEmailAuth.init(
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
        verify_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        verify_status: {
            type: DataTypes.STRING,
            allowNull: false,
            values: ['Y', 'N'],
            defaultValue: 'N',
        },
    },
    {
        tableName: 'user_email_auth',
        sequelize,
    }
);

UserEmailAuth.hasOne(Users, {
    sourceKey: 'user_id',
    foreignKey: 'id',
    as: 'user',
});

export default UserEmailAuth;
