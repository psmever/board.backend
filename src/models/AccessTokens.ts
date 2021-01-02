import { Model, DataTypes, Optional, HasOneGetAssociationMixin, Association } from 'sequelize';
import { sequelize } from '@src/instances/Sequelize';
import Users from '@src/models/Users';
import RefreshTokens from '@src/models/RefreshTokens';

interface AccessTokensAttributes {
    id: string;
    user_id: number;
    revoked: 'Y' | 'N';
    expiresAt: string;
}

type AccessTokensCreationAttributes = Optional<AccessTokensAttributes, 'id'>;

class AccessTokens extends Model<AccessTokensAttributes, AccessTokensCreationAttributes>
    implements AccessTokensAttributes {
    public id!: string;
    public user_id!: number;
    public revoked!: 'Y' | 'N';
    public expiresAt!: string;

    public getUser!: HasOneGetAssociationMixin<Users>; // Note the null assertions!
    public getRefreshToken!: HasOneGetAssociationMixin<RefreshTokens>; // Note the null assertions!

    public readonly user?: Users; // Note this is optional since it's only populated when explicitly requested in code
    public readonly refreshtoken?: RefreshTokens; // Note this is optional since it's only populated when explicitly requested in code

    public static associations: {
        user: Association<AccessTokens, Users>;
        refreshtoken: Association<AccessTokens, RefreshTokens>;
    };
}

AccessTokens.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING,
        },
        revoked: {
            type: DataTypes.STRING,
        },
        expiresAt: {
            field: 'expiresAt',
            type: 'TIMESTAMP',
        },
    },
    {
        tableName: 'access_tokens',
        timestamps: true,
        sequelize,
    }
);

AccessTokens.hasOne(Users, {
    sourceKey: 'user_id',
    foreignKey: 'id',
    as: 'user',
});
AccessTokens.hasOne(RefreshTokens, {
    sourceKey: 'id',
    foreignKey: 'access_token_id',
    as: 'refreshtoken',
});

export default AccessTokens;
