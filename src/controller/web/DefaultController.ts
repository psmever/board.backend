import { Request, Response } from 'express';
import { isEmpty, globalConfig } from '@common';
import UserEmailAuth from '@src/models/UserEmailAuth';
import Users from '@src/models/Users';

// 기본 서버 상태 체크.
export const index = async (req: Request, res: Response): Promise<void> => {
    res.render('index', { title: `${globalConfig.app_name}`, env: globalConfig.app_env });
};

interface CheckResult {
    status: boolean;
    message: string;
}

// 인증 체크 및 처리.
const checkAuthCode = async (authCode: string): Promise<CheckResult> => {
    const task = await UserEmailAuth.findOne({
        where: {
            verify_code: authCode,
        },
        include: [UserEmailAuth.associations.user],
        raw: true,
        nest: true,
    });

    // 유효한 인증 코드 인지 인증 코드 인지.
    if (isEmpty(task)) {
        return {
            status: false,
            message: '정상 적인 인증 코드가 아닙니다.',
        };
    }

    const task_id = task && task.id ? task.id : null;
    const verify_status = task && task.verify_status ? task.verify_status : null;
    const user_id = task && task.user && task.user_id ? task.user_id : null;
    const user_active = task && task.user && task.user.active ? task.user.active : null;

    if (verify_status === 'Y' && user_active === 'N') {
        return {
            status: false,
            message: '정상 적인 사용자가 아닙니다.',
        };
    }

    if (verify_status === 'Y' && user_active === 'Y') {
        return {
            status: false,
            message: '이미 인증이 완료된 사용자 입니다.',
        };
    }

    // 인증 처리.
    await UserEmailAuth.update(
        {
            verify_status: 'Y',
        },
        {
            where: { id: task_id },
        }
    );

    await Users.update(
        {
            active: 'Y',
        },
        {
            where: { id: user_id },
        }
    );

    return {
        status: true,
        message: '인증이 완료 되었습니다.',
    };
};

// 이메일 인증 페이지.
export const emailauth = async (req: Request, res: Response): Promise<void> => {
    const {
        params: { authcode },
    } = req;

    const checkStatus = await checkAuthCode(authcode);
    console.log(checkStatus);

    return res.render('emailauth', { checkStatus: checkStatus });
};
