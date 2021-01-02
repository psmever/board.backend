import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Logger, globalConfig } from '@common';
import { Op } from 'sequelize';
import { AccessTokens, Users } from '@models';
import moment from 'moment';
const serverSecret = globalConfig.server_secret ? globalConfig.server_secret : '';
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: serverSecret,
};
// 이걸 어떻게 써먹어야 하나?
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

const Passport = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport: any
): Promise<{
    id: number;
    user_uuid: string;
    user_level: string;
    user_name: string;
    user_password: string;
    user_email: string;
    active: string;
    profile_active: string;
    createdAt: string;
    userLevel: {
        id: number;
        group_id: string;
        code_id: string;
        group_name: boolean;
        code_name: string;
        active: string;
        createdAt: string;
        updatedAt: string;
    };
}> => {
    return passport.use(
        new JwtStrategy(opts, async (jwtPayload, done) => {
            const accessToken_id = jwtPayload.accessToken_id;

            const tokenInfo = await AccessTokens.findOne({
                where: {
                    id: accessToken_id,
                    revoked: 'N',
                    expiresAt: {
                        [Op.gt]: moment().format('YYYY-MM-DD HH:mm:ss'),
                    },
                },
                order: [['createdAt', 'DESC']],
                include: [AccessTokens.associations.user, AccessTokens.associations.refreshtoken],
                raw: true,
                nest: true,
                // logging: console.log,
            });

            if (!tokenInfo || !tokenInfo?.user || !tokenInfo?.user?.id) {
                return done(null, false);
            }

            Users.findOne({
                where: { id: tokenInfo?.user?.id },
                include: [Users.associations.userLevel],
                raw: true,
                nest: true,
            })
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => Logger.error(`error`, err));
        })
    );
};

export default Passport;
