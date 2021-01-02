import { Sequelize } from 'sequelize';
import { Logger } from '@Helper';
import GlobalConfig from '@GlobalConfig';

const config = {
    username: GlobalConfig.mysql_username ? GlobalConfig.mysql_username : '',
    password: GlobalConfig.mysql_password ? GlobalConfig.mysql_password : '',
    database: GlobalConfig.mysql_database ? GlobalConfig.mysql_database : '',
    host: GlobalConfig.mysql_host ? GlobalConfig.mysql_host : 'localhost',
    dialect: 'mariadb',
    port: GlobalConfig.mysql_port ? Number(GlobalConfig.mysql_port) : 3306,
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
