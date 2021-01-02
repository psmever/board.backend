import express, { Application } from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
import passport from 'passport';
import { Logger, isEmpty, globalConfig } from '@common';
import Passport from '@src/middlewares/Passport';
import path from 'path';

// FIXME : 2020-12-15 22:43  cors 작동 안됨.
// const options: cors.CorsOptions = {
//     allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
//     credentials: true,
//     methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
//     origin: globalConfig.HOSTNAME,
//     preflightContinue: false,
// };

import { RestAfterMiddleware, RestBeforeAfterMiddleware, RestMiddleware } from '@src/middlewares';
import { TestsRouter, SystemsRouter, AuthRouter, DefaultRouter } from '@src/routers';

function addRouters(app: Application): void {
    const baseApiRoute = '/api';
    const baseWebRoute = '/web';
    // const baseRouteVersion = '/v1';

    app.use(`${baseApiRoute}`, RestBeforeAfterMiddleware);

    app.use(`${baseApiRoute}/tests`, RestMiddleware, TestsRouter);
    app.use(`${baseApiRoute}/systems`, RestMiddleware, SystemsRouter);
    app.use(`${baseApiRoute}/auth`, RestMiddleware, AuthRouter);

    app.use(`${baseApiRoute}`, RestAfterMiddleware);

    app.use(`${baseWebRoute}`, DefaultRouter);
}

interface CheckEnvironmentResult {
    state: boolean;
    message: string;
}

// FIXME: 2020-12-27 17:49  나중에 파일로 따로 빼자.
export const checkEnvironment = (): CheckEnvironmentResult => {
    if (isEmpty(globalConfig.bcrypt_saltrounds)) {
        return {
            state: false,
            message: `not found Environment bcrypt_saltrounds `,
        };
    }

    if (isEmpty(globalConfig.server_secret)) {
        return {
            state: false,
            message: `not found Environment server_secret `,
        };
    }

    if (isEmpty(globalConfig.encryption_key)) {
        return {
            state: false,
            message: `not found Environment encryption_key `,
        };
    }

    if (isEmpty(globalConfig.refresh_token_expirein)) {
        return {
            state: false,
            message: `not found Environment refresh_token_expirein `,
        };
    }

    if (isEmpty(globalConfig.access_token_expirein)) {
        return {
            state: false,
            message: `not found Environment access_token_expirein `,
        };
    }

    return {
        state: true,
        message: `check end `,
    };
};

// 서버 설정.
export function initServer(app: Application): void {
    app.engine('pug', require('pug').__express);

    app.set('views', path.join(__dirname, 'resources/views'));
    app.set('view engine', 'pug');
    app.use(express.static(path.join(__dirname, 'resources')));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(passport.initialize());

    Passport(passport);

    addRouters(app);

    return;
}

// 서버 시작.
export function startServer(app: Application): void {
    const port = globalConfig.port || 3000;
    const appEnv = globalConfig.app_env || `NOT FOUND APP ENV`;
    const appName = globalConfig.app_name || `NOT FOUND APP NAME`;

    app.listen(port, () => Logger.info(`\nExpress :: ${appName} ${appEnv} :: running on port ${port}\n`, null, true));
}
