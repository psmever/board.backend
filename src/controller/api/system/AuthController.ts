import { Request, Response, NextFunction } from 'express';
import { Logger, isEmpty } from '@Helper';
import {
    clientErrorResponse,
    baseSuccessResponse,
    serverErrorResponse,
    tokenResponse,
    authenticateErrorResponse,
    onlyDataSuccessResponse,
} from '@Providers';
import { responseMessage } from '@src/common/providers/ResponseMessage';
import { sequelize } from '@src/instances/Sequelize';
import { v4 as uuidv4 } from 'uuid';
import MailSender from '@src/common/helper/MailSender';
import bcrypt from 'bcrypt';

import Users from '@src/models/Users';
import UserProfiles from '@src/models/UserProfiles';
import UserEmailAuth from '@src/models/UserEmailAuth';
import UserType from '@src/models/UserType';
import { generateLoginToken, generateTokenRefresh } from '@src/common/helper/Tokens';
import GlobalConfig from '@GlobalConfig';

const serverSecret = GlobalConfig.server_secret ? GlobalConfig.server_secret : '';

export const authenticateError = async (req: Request, res: Response): Promise<void> => {
    authenticateErrorResponse(res);
};

// 로그인
export const login = async (req: Request, res: Response): Promise<void> => {
    if (isEmpty(serverSecret)) {
        serverErrorResponse(res, { message: responseMessage.error.serverError });
        Logger.warn(`error SERVER_SECRET 값을 찾을수 없습니다.`, {
            rawHeaders: req.rawHeaders,
            body: req.body,
        });
    }

    const { login_email, login_password } = req.body;

    if (isEmpty(login_email)) {
        clientErrorResponse(res, {
            message: responseMessage.default.notfound.email,
        });
        return;
    }

    if (isEmpty(login_password)) {
        clientErrorResponse(res, {
            message: responseMessage.default.notfound.password,
        });
        return;
    }

    //사용자 체크.
    const exitsUser = await Users.findOne<Users>({
        where: {
            user_email: login_email,
        },
        attributes: [
            'id',
            'user_uuid',
            'user_level',
            'user_email',
            'user_password',
            'user_name',
            'active',
            'profile_active',
        ],
        raw: true,
        nest: true,
    }).then(rowData => {
        if (rowData === null) return {};

        return {
            user_id: rowData.id,
            user_uuid: rowData.user_uuid,
            user_level: rowData.user_level,
            user_email: rowData.user_email,
            user_password: rowData.user_password,
            user_name: rowData.user_name,
            active: rowData.active,
            profile_active: rowData?.profile_active,
        };
    });

    if (isEmpty(exitsUser)) {
        clientErrorResponse(res, {
            message: responseMessage.default.notfound.exitsUser,
        });
        return;
    }

    const { user_id, user_uuid, user_level, user_email, user_password, user_name, active, profile_active } = exitsUser;

    if (active !== 'Y') {
        clientErrorResponse(res, {
            message: responseMessage.default.check.login_fail_user_active,
        });
        return;
    }

    if (
        isEmpty(user_id) ||
        isEmpty(user_uuid) ||
        isEmpty(user_level) ||
        isEmpty(user_email) ||
        isEmpty(user_password) ||
        isEmpty(user_name) ||
        isEmpty(active) ||
        isEmpty(profile_active)
    ) {
        serverErrorResponse(res, { message: responseMessage.error.serverError });
        Logger.warn(`error 비밀 번호 확인중 문제가 발생했습니다.`, {
            rawHeaders: req.rawHeaders,
            body: req.body,
        });
    }

    const checkPassword = bcrypt.compareSync(login_password, String(user_password));

    if (checkPassword === false) {
        clientErrorResponse(res, {
            message: responseMessage.default.check.loginPassword,
        });
        return;
    }

    const tokenGenData = await generateLoginToken({
        user_id: Number(user_id),
    });

    if (tokenGenData.state === false) {
        serverErrorResponse(res, { error: tokenGenData.error });
    } else {
        tokenResponse(res, {
            refresh_token: tokenGenData.RefreshToken,
            access_token: tokenGenData.AccessToken,
        });
    }
};

// 회원 가입.
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { register_username, register_email, register_password } = req.body;

    // 사용자 이름.
    if (isEmpty(register_username)) {
        clientErrorResponse(res, {
            message: responseMessage.default.notfound.usename,
        });
        return;
    }

    // 사용자 이메일 없을경우.
    if (isEmpty(register_email)) {
        clientErrorResponse(res, {
            message: responseMessage.default.notfound.email,
        });
        return;
    }
    // 사용자 비밀번호가 없을경우.
    if (isEmpty(register_password)) {
        clientErrorResponse(res, {
            message: responseMessage.default.notfound.password,
        });
        return;
    }

    //이메일 중복 체크.
    const exitsEmail = await Users.findOne({
        where: {
            user_email: register_email,
        },
        attributes: ['id'],
    });

    if (isEmpty(exitsEmail) === false) {
        // 존재 하는 이메일.
        clientErrorResponse(res, {
            message: responseMessage.default.check.email,
        });
        return;
    }

    // 사용자 이름 중복 체크.
    const exitsName = await Users.findOne({
        where: {
            user_name: register_username,
        },
        attributes: ['id'],
    });

    if (isEmpty(exitsName) === false) {
        // 존재 하는 사용자 이름.
        clientErrorResponse(res, {
            message: responseMessage.default.check.name,
        });
        return;
    }

    const newUserUUID = uuidv4();
    const emailAuthCode = Array.from({ length: 70 }, () => Math.random().toString(36)[2]).join('');

    // 정상 입력.

    // 사용자 테이블 입력.
    const transaction = await sequelize.transaction();
    try {
        const task = await Users.create(
            {
                user_uuid: newUserUUID,
                user_email: register_email,
                user_name: register_username,
                user_password: bcrypt.hashSync(register_password, Number(GlobalConfig.bcrypt_saltrounds)),
                user_level: 'A30010',
                active: 'N',
                profile_active: 'N',
            },
            { transaction }
        );

        await UserProfiles.create(
            {
                user_id: task.id,
            },
            { transaction }
        );

        await UserEmailAuth.create(
            {
                user_id: task.id,
                verify_code: emailAuthCode,
                verify_status: 'N',
            },
            { transaction }
        );

        await UserType.create(
            {
                user_id: task.id,
                user_type: 'A30010',
            },
            { transaction }
        );

        if (GlobalConfig.app_env === 'production') {
            MailSender.SendEmailAuth({
                ToEmail: register_email,
                EmailAuthCode: emailAuthCode,
            });
        } else {
            Logger.info(`emailAuthCode :: ${emailAuthCode}`, null, true);
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();

        serverErrorResponse(res, { name: error.name });
        Logger.error(`error`, error);
    }

    baseSuccessResponse(res, {
        message: responseMessage.default.success.register,
    });

    next();
};

// access token 으로 사용자 정보 조회.
export const usercheck = async (req: Request, res: Response): Promise<void> => {
    onlyDataSuccessResponse(res, {
        id: req.user?.id,
        user_uuid: req.user?.user_uuid,
        user_name: req.user?.user_name,
        user_email: req.user?.user_email,
        active: req.user?.active,
        profile_active: req.user?.profile_active,
        createdAt: req.user?.createdAt,
        userlevel: {
            code_id: req.user?.userLevel?.code_id,
            code_name: req.user?.userLevel?.code_name,
        },
    });
};

// 토큰 새로 고침
export const tokenRefresh = async (req: Request, res: Response): Promise<void> => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        clientErrorResponse(res, {
            message: responseMessage.default.check.not_found_refresh_token,
        });
        return;
    }

    const task = await generateTokenRefresh({
        refresh_token: refresh_token,
    });

    if (task.state === false) {
        clientErrorResponse(res, {
            message: task.message,
        });
        return;
    }

    tokenResponse(res, {
        refresh_token: task.RefreshToken,
        access_token: task.AccessToken,
    });
};
