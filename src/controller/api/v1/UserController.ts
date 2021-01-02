import { Request, Response, NextFunction } from 'express';
import { serverErrorResponse, responseMessage, clientErrorResponse, baseSuccessResponse } from '@Providers';
import { isEmpty } from '@Helper';
import { UserProfiles, Users, UserNameChangeLog } from '@Models';
import moment from 'moment';

// 프로필 업데이트.
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const user_id = req.user?.id;
    const user_name = req.user?.user_name;

    if (!user_id || !user_name) {
        clientErrorResponse(res, {
            message: responseMessage.default.check.get_user_info_error,
        });
        return;
    }

    const { user_name: input_user_name, profile_intro: input_profile_intro } = req.body;

    // 사용자 이름.
    if (isEmpty(input_user_name)) {
        clientErrorResponse(res, {
            message: responseMessage.default.validation.user_name,
        });
        return;
    }

    // 자기 소개.
    if (isEmpty(input_profile_intro)) {
        clientErrorResponse(res, {
            message: responseMessage.default.validation.profile_intro,
        });
        return;
    }

    if (user_name !== input_user_name) {
        // 사용자 이름 중복 체크.
        const exitsName = await Users.findOne({
            where: {
                user_name: input_user_name,
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

        await Users.update({ user_name: input_user_name }, { where: { id: user_id } });

        await UserNameChangeLog.create({
            user_id: user_id,
            before_name: user_name,
            after_name: input_user_name,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
    }

    await UserProfiles.update(
        {
            profile_intro: input_profile_intro,
        },
        {
            where: {
                user_id: user_id,
            },
        }
    );

    const getResult = await Users.findOne({
        where: {
            id: user_id,
        },
        order: [['createdAt', 'DESC']],
        include: [Users.associations.userProfile, Users.associations.userLevel],
        raw: true,
        nest: true,
        // logging: console.log,
    });

    baseSuccessResponse(res, {
        result: {
            user_uuid: getResult?.user_uuid,
            user_name: getResult?.user_name,
            user_profile: {
                profile_intro: getResult?.userProfile?.profile_intro,
            },
        },
    });
};
