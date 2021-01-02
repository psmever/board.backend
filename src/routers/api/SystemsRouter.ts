import { Router } from 'express';
import {
    checkStatus,
    checkNotice,
    appVersionCheck,
    baseData,
    defaultUser,
} from '@controller/api/system/SystemController';

export const SystemsRouter = Router();

// 기본 상태 체크
SystemsRouter.get('/check-status', checkStatus);

// 기본 서버 공지사항.
SystemsRouter.get('/check-notice', checkNotice);

// 앱 버전 체크.
SystemsRouter.get('/check-app-version', appVersionCheck);

// 기본 데이터.
SystemsRouter.get('/base-data', baseData);

// 기본 데이터.
SystemsRouter.get('/default-user', defaultUser);
