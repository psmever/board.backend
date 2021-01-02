import dotenv from 'dotenv';
dotenv.config();

const globalConfig = {
    node_env: process.env.NODE_ENV,
    app_name: process.env.APP_NAME,
    app_env: process.env.APP_ENV,
    port: process.env.PORT,
    hostname: process.env.HOSTNAME,
    mysql_username: process.env.MYSQL_USERNAME,
    mysql_password: process.env.MYSQL_PASSWORD,
    mysql_database: process.env.MYSQL_DATABASE,
    mysql_host: process.env.MYSQL_HOST,
    mysql_dialect: process.env.MYSQL_DIALECT,
    mysql_port: process.env.MYSQL_PORT,
    gmail_username: process.env.GMAIL_USERNAME,
    gmail_password: process.env.GMAIL_PASSWORD,
    bcrypt_saltrounds: process.env.BCRYPT_SALTROUNDS,
    server_secret: process.env.SERVER_SECRET,
    encryption_key: process.env.ENCRYPTION_KEY,
    refresh_token_expirein: process.env.REFRESH_TOKEN_EXPIREIN,
    access_token_expirein: process.env.ACCESS_TOKEN_EXPIREIN,
};

export { globalConfig };
