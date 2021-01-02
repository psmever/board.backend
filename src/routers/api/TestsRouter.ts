import { Router } from 'express';
import { Default } from '@controller/api/test/TestController';

export const TestsRouter = Router();

// 기본 테스트.
// TestsRouter.get('/default', passport.authenticate('jwt', { session: false }), Default);
TestsRouter.get(
    '/default',
    // passport.authenticate('jwt', { failureRedirect: '/api/auth/authenticate', session: false }),
    Default
);
