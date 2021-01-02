import { Request, Response } from 'express';
import { GenerateToken } from '@Helper';
import { baseSuccessResponse } from '@Providers';
import { v4 as uuidv4 } from 'uuid';
import jsonwebtoken from 'jsonwebtoken';
import GlobalConfig from '@GlobalConfig';

const serverSecret = GlobalConfig.server_secret ? GlobalConfig.server_secret : '';

// 기본 테스트.
export const Default = async (req: Request, res: Response): Promise<void> => {
    let token = {
        token: '',
    };

    const payload = {
        user_id: 'asdasd',
        user_uuid: 'asdasd',
        user_level: 'asdasd',
        user_email: 'asdasd',
        user_password: 'asdasd',
        user_name: 'asdasd',
        active: 'asdasd',
        profile_active: 'asdasd',
    };

    const ntoken = jsonwebtoken.sign(payload, serverSecret, {
        expiresIn: 3600,
    });

    token = {
        token: ntoken,
    };

    baseSuccessResponse(res, {
        uuidv4: uuidv4(),
        access_token: token,
        token: GenerateToken(),
    });
};
