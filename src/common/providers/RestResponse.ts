import { Response } from 'express';
import { httpStatus, responseStatus, responseMessage } from '@src/common/providers/ResponseMessage';
import { AppHttpResponseErrorMessage, ServerNoticeResponsePayload, ServerAppversionResponsePayload } from 'CommonTypes';
import { isEmpty } from '../helper';

// 기본 내용없음.
export function noCotentResponse(response: Response): Response {
    return response.status(httpStatus.nocontent).json();
}

// 서버 공지사항.
export function baseNoticeResponse(response: Response, payload: ServerNoticeResponsePayload): Response {
    return response.status(httpStatus.success).json(payload);
}

// 앱 버전.
export function baseAppversionResponse(response: Response, payload: ServerAppversionResponsePayload): Response {
    return response.status(httpStatus.success).json(payload);
}

// 서버 에러.
export function serverErrorResponse<T>(response: Response, errorPayload?: T): Response {
    let errorResponse = {};

    errorResponse = {
        status: responseStatus.error,
        message: responseMessage.error.serverError,
    };

    if (isEmpty(errorPayload) === false) {
        errorResponse = Object.assign(errorResponse, { error: errorPayload });
    }

    return response.status(httpStatus.error).json(errorResponse);
}
// 클라이언트 에러.
export function clientErrorResponse(response: Response, message: AppHttpResponseErrorMessage): Response {
    return response.status(httpStatus.bad).json({
        status: responseStatus.error,
        ...message,
    });
}

// 기본 성공.
export function baseSuccessResponse<T>(response: Response, payload: T): Response {
    return response.status(httpStatus.success).json({
        status: responseStatus.success,
        ...payload,
    });
}

// 데이터만.
export function onlyDataSuccessResponse<T>(response: Response, payload: T): Response {
    return response.status(httpStatus.success).json({
        ...payload,
    });
}

// 인증 에러.
export function authenticateErrorResponse(response: Response): Response {
    return response.status(httpStatus.unauthorized).json({
        message: responseMessage.error.needlogin,
    });
}

// 로그인 토큰
export const tokenResponse = <T>(response: Response, token: T): Response => {
    return response.status(httpStatus.success).json({
        ...token,
    });
};
