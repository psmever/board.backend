import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@src/instances/Sequelize';

interface CodesAttributes {
    id: number;
    group_id: string;
    code_id: string | null;
    group_name: string | null;
    code_name: string | null;
    active: 'Y' | 'N';
}

type CodesCreationAttributes = Optional<CodesAttributes, 'id'>;

class Codes extends Model<CodesAttributes, CodesCreationAttributes> implements CodesAttributes {
    public id!: number;
    public group_id!: string;
    public code_id!: string | null;
    public group_name!: string | null;
    public code_name!: string | null;
    public active!: 'Y' | 'N';

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Codes.init(
    {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        group_id: {
            type: DataTypes.STRING(3),
            allowNull: true,
            defaultValue: null,
        },
        code_id: {
            type: DataTypes.STRING(6),
            defaultValue: null,
            unique: true,
        },
        group_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        },
        code_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        },
        active: {
            type: DataTypes.ENUM,
            values: ['Y', 'N'],
            allowNull: false,
            defaultValue: 'Y',
        },
    },
    {
        tableName: 'codes',
        sequelize,
    }
);

export default Codes;
