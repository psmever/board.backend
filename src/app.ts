import express, { Application } from 'express';
import * as startup from './startup';
import { Logger } from '@common';

const checkResult = startup.checkEnvironment();

if (checkResult.state === true) {
    const app: Application = express();

    startup.initServer(app);
    startup.startServer(app);
} else {
    Logger.info(`\nExpress start Error :: ${checkResult.message}\n`, null, true);
}
