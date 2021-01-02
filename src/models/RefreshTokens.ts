import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@src/instances/Sequelize';

interface RefreshTokensAttributes {
    id: string;
    access_token_id: string;
    revoked: 'Y' | 'N';
    expiresAt: string;
}

type RefreshTokensCreationAttributes = Optional<RefreshTokensAttributes, 'id'>;

class RefreshTokens extends Model<RefreshTokensAttributes, RefreshTokensCreationAttributes>
    implements RefreshTokensAttributes {
    public id!: string;
    public access_token_id!: string;
    public revoked!: 'Y' | 'N';
    public expiresAt!: string;
}

RefreshTokens.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        access_token_id: {
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
        tableName: 'refresh_tokens',
        timestamps: false,
        sequelize,
    }
);

export default RefreshTokens;
