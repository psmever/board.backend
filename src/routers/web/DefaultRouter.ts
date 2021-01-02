import { Router } from 'express';
import { index, emailauth } from '@controller/web/DefaultController';

export const DefaultRouter = Router();

DefaultRouter.get('/index', index);

DefaultRouter.get('/emailauth/:authcode', emailauth);
