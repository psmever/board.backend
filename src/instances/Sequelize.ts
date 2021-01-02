import { Sequelize } from 'sequelize';
import { globalConfig, Logger } from '@common';

const config = {
    username: globalConfig.mysql_username ? globalConfig.mysql_username : '',
    password: globalConfig.mysql_password ? globalConfig.mysql_password : '',
    database: globalConfig.mysql_database ? globalConfig.mysql_database : '',
    host: globalConfig.mysql_host ? globalConfig.mysql_host : 'localhost',
    dialect: 'mariadb',
    port: globalConfig.mysql_port ? Number(globalConfig.mysql_port) : 3306,
};

/**
 * https://sequelize.org/master
 */
export const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mariadb',
    port: config.port,
    logging: false,
    dialectOptions: { charset: 'utf8mb4', dateStrings: true, typeCast: true }, // 날짜의 경우 문자열로 타입 변경 처리
    timezone: '+09:00', // 타임존 설정
});

sequelize.authenticate().then(
    function() {
        Logger.info(`DB connection sucessful.`, null, true);
    },
    function(err) {
        // catch error here
        Logger.info(`DB connection error.`, err, true);
    }
);
