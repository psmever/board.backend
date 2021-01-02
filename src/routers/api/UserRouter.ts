import { Router } from 'express';
import { updateProfile } from '@Controller/api/v1/UserController';
import passport from 'passport';

export const UserRouter = Router();

// 프로필 정보 수정.
UserRouter.post(
    '/user-profile',
    passport.authenticate('jwt', { failureRedirect: '/api/auth/authenticate', session: false }),
    updateProfile
);
