import { Router } from 'express';
import { index, emailauth } from '@Controller/web/DefaultController';

export const DefaultRouter = Router();

// 기본 인덱스 페이지.
DefaultRouter.get('/index', index);

// 이메일 인증 페이지.
DefaultRouter.get('/emailauth/:authcode', emailauth);
