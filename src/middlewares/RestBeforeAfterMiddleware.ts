import { Request, Response, NextFunction } from 'express';
import { isEmpty } from '@Helper';
import { clientErrorResponse } from '@Providers';
import { responseMessage } from '@src/common/providers/ResponseMessage';

export const RestBeforeAfterMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE,GET,PATCH,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

    // 클라이언트 타입 체크
    if (isEmpty(req.headers['request-client-type'])) {
        clientErrorResponse(res, {
            message: responseMessage.error.clientTypeNotFound,
        });
        return;
    }

    // accept 체크
    if (isEmpty(req.headers['accept'])) {
        clientErrorResponse(res, {
            message: responseMessage.error.defaultClientError + '1',
        });
        return;
    }

    // Content-type 체크
    // 로그인 에러 라우터 제외.
    if (isEmpty(req.headers['content-type']) && req.path !== '/auth/authenticate') {
        clientErrorResponse(res, {
            message: responseMessage.error.defaultClientError,
        });
        return;
    }

    next();
};
