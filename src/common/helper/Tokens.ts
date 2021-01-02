import { Logger, GenerateToken, Encrypt, Decrypt, globalConfig } from '@common';
import { sequelize } from '@src/instances/Sequelize';
import moment from 'moment';
import jsonwebtoken from 'jsonwebtoken';
import { AccessTokens, RefreshTokens } from '@models';
import { responseMessage } from '@src/common/providers/ResponseMessage';

const serverSecret = globalConfig.server_secret ? globalConfig.server_secret : '';

// 디비에서 사용자 토큰 정보 조회.
const getUserToken = async ({
    user_id,
}: {
    user_id: number;
}): Promise<{
    state: boolean;
    result?: AccessTokens;
}> => {
    return await AccessTokens.findOne({
        where: {
            user_id: user_id,
            revoked: 'N',
        },
        order: [['createdAt', 'DESC']],
        include: [AccessTokens.associations.user, AccessTokens.associations.refreshtoken],
        raw: true,
        nest: true,
        // logging: console.log,
    }).then(result => {
        if (result === null) {
            return {
                state: false,
            };
        }

        return {
            state: true,
            result: result,
        };
    });
};

// 토큰 생성 ( 랜덤 문자열. )
const makeNewTokenId = async (): Promise<{
    refreshToken: string;
    accessToken: string;
}> => {
    return {
        refreshToken: Array.from({ length: 80 }, () => Math.random().toString(36)[2]).join(''),
        accessToken: GenerateToken(),
    };
};

// refresh token 저장.
const insertRefreshToken = async ({ id, access_token_id }: { id: string; access_token_id: string }): Promise<void> => {
    const transaction = await sequelize.transaction();
    try {
        await RefreshTokens.create(
            {
                id: id,
                access_token_id: access_token_id,
                revoked: 'N',
                expiresAt: moment()
                    .add(globalConfig.refresh_token_expirein, 'hours')
                    .format('YYYY-MM-DD HH:mm:ss'),
            },
            { transaction }
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();

        Logger.error(`error`, error);
    }
};

// refresh 토큰 revoke
const revokedRefreshToken = async ({ id }: { id: string }): Promise<void> => {
    try {
        await RefreshTokens.update(
            {
                revoked: 'Y',
            },
            {
                where: { id: id },
            }
        );
    } catch (error) {
        Logger.error(`error`, error);
    }
};

// access 토큰 저장.
const insertAccssToken = async ({ id, user_id }: { id: string; user_id: number }): Promise<void> => {
    const transaction = await sequelize.transaction();
    try {
        await AccessTokens.create(
            {
                id: id,
                user_id: user_id,
                revoked: 'N',
                expiresAt: moment()
                    .add(globalConfig.access_token_expirein, 'hours')
                    .format('YYYY-MM-DD HH:mm:ss'),
            },

            { transaction }
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();

        Logger.error(`error`, error);
    }
};

// access 토큰 revoke.
const revokedAccessToken = async ({ id }: { id: string }): Promise<void> => {
    try {
        await AccessTokens.update(
            {
                revoked: 'Y',
            },
            {
                where: { id: id },
            }
        );
    } catch (error) {
        Logger.error(`error`, error);
    }
};

// const updateAccessTokenExpires = async ({ id }: { id: string }): Promise<void> => {
//     try {
//         await AccessTokens.update(
//             {
//                 expiresAt: moment()
//                     .add(globalConfig.access_token_expirein, 'hours')
//                     .format('YYYY-MM-DD HH:mm:ss'),
//             },
//             {
//                 where: { id: id },
//             }
//         );
//     } catch (error) {
//         Logger.error(`error`, error);
//     }
// };

// refresh 토큰 생성 (id 암호화.)
const generateRefreshToken = ({ token_id }: { token_id: string }): string => {
    return Encrypt(token_id);
};

// refresh 토큰 정보 ( 토큰 복호화.)
const DecryptRefreshToken = ({ RefreshToken }: { RefreshToken: string }): string => {
    return Decrypt(RefreshToken);
};

// jwt 생성.
const generateAccessToken = ({
    refresh_token_id,
    accessToken_id,
    user_id,
}: {
    refresh_token_id: string;
    accessToken_id: string;
    user_id: number;
}): string => {
    return jsonwebtoken.sign(
        {
            refresh_token_id: refresh_token_id,
            accessToken_id: accessToken_id,
            user_id: user_id,
        },
        serverSecret,
        {
            expiresIn: 3600 * Number(globalConfig.access_token_expirein),
        }
    );
};

// 토큰 신규 발행.
const makeNewToken = async ({
    user_id,
}: {
    user_id: number;
}): Promise<{
    RefreshToken: string;
    AccessToken: string;
}> => {
    // 토큰 새로 생성.
    const { refreshToken, accessToken } = await makeNewTokenId();
    await insertRefreshToken({ id: refreshToken, access_token_id: accessToken });
    await insertAccssToken({ id: accessToken, user_id: user_id });

    const taskRefreshToken = generateRefreshToken({ token_id: refreshToken });
    const taskAccessToken = generateAccessToken({
        refresh_token_id: refreshToken,
        accessToken_id: accessToken,
        user_id: user_id,
    });

    return {
        RefreshToken: taskRefreshToken,
        AccessToken: taskAccessToken,
    };
};

// 로그인 토큰 체크및 생성.
const generateLoginToken = async ({
    user_id,
}: {
    user_id: number;
}): Promise<{
    state: boolean;
    RefreshToken: string;
    AccessToken: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
}> => {
    let newToken = {
        RefreshToken: '',
        AccessToken: '',
    };

    try {
        if (!user_id) return { state: false, RefreshToken: '', AccessToken: '' };

        const task = await getUserToken({ user_id: user_id });
        const { state, result } = task;

        // 토큰 정보가 없을떄.
        if (state === true && result?.refreshtoken?.id && result?.id) {
            const RefreshToken = result?.refreshtoken?.id;
            const AccessToken = result?.id;

            await revokedRefreshToken({ id: RefreshToken });
            await revokedAccessToken({ id: AccessToken });
        }

        // 토큰 새로 생성.
        newToken = await makeNewToken({ user_id: user_id });

        return {
            state: true,
            RefreshToken: newToken.RefreshToken,
            AccessToken: newToken.AccessToken,
        };
    } catch (error) {
        Logger.error(`error`, error);
        return {
            state: true,
            RefreshToken: '',
            AccessToken: '',
            error: error,
        };
    }
};

// 토큰 새로 고침.
const generateTokenRefresh = async ({
    refresh_token,
}: {
    refresh_token: string;
}): Promise<{
    state: boolean;
    message: string;
    RefreshToken: string;
    AccessToken: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
}> => {
    const rToken = await RefreshTokens.findOne({
        where: {
            id: DecryptRefreshToken({ RefreshToken: refresh_token }),
        },
        raw: true,
        nest: true,
        // logging: console.log,
    });

    if (rToken === null) {
        return {
            state: false,
            message: responseMessage.default.check.fail_refresh_token,
            RefreshToken: '',
            AccessToken: '',
        };
    }

    const { id: refresh_token_id, access_token_id, revoked } = rToken;

    if (revoked === 'Y') {
        return {
            state: false,
            message: responseMessage.default.check.fail_refresh_token_revoked,
            RefreshToken: '',
            AccessToken: '',
        };
    }

    const chAccessTokens = await AccessTokens.findOne({
        where: {
            id: access_token_id,
            revoked: 'N',
        },
        include: [AccessTokens.associations.user, AccessTokens.associations.refreshtoken],
        raw: true,
        nest: true,
        // logging: console.log,
    });

    if (chAccessTokens === null) {
        return {
            state: false,
            message: responseMessage.default.check.fail_refresh_token_access_token,
            RefreshToken: '',
            AccessToken: '',
        };
    }

    if (!chAccessTokens.user || !chAccessTokens.user.id || chAccessTokens.user.active === 'N') {
        return {
            state: false,
            message: responseMessage.default.check.fail_refresh_token_user_id,
            RefreshToken: '',
            AccessToken: '',
        };
    }

    await revokedRefreshToken({ id: refresh_token_id });
    await revokedAccessToken({ id: access_token_id });

    const user_id = chAccessTokens.user.id;

    // 토큰 새로 생성.
    const newToken = await makeNewToken({ user_id: user_id });

    return {
        state: true,
        message: '',
        RefreshToken: newToken.RefreshToken,
        AccessToken: newToken.AccessToken,
    };
};

export { generateLoginToken, generateTokenRefresh };
