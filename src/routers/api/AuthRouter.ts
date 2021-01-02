import { Router } from 'express';
import { login, register, authenticateError, usercheck, tokenRefresh } from '@controller/api/system/AuthController';
import passport from 'passport';

export const AuthRouter = Router();

// 회원 가입
AuthRouter.post('/register', register);
// 로그인
AuthRouter.post('/login', login);
// 인증 에러.
AuthRouter.get('/authenticate', authenticateError);

// 로그인 사용자 정보.
// 토큰 시간 체크.
AuthRouter.post(
    '/user-check',
    passport.authenticate('jwt', { failureRedirect: '/api/auth/authenticate', session: false }),
    // passport.authenticate('jwt', { session: false }),
    usercheck
);

// 토큰 리프레시
AuthRouter.post('/token-refresh', tokenRefresh);
