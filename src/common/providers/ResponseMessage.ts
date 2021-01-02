// http 상태.
const httpStatus = {
    success: 200,
    error: 500,
    notfound: 404,
    unauthorized: 401,
    conflict: 409,
    created: 201,
    bad: 400,
    nocontent: 204,
};

// 결과 상태.
const responseStatus = {
    success: true,
    error: false,
};

const responseMessage = {
    error: {
        defaultClientError: '잘못된 요청 입니다.',
        clientTypeNotFound: '클라이언트 정보가 존재 하지 않습니다.',
        serverError: '처리중 문제가 발생 했습니다.',
        serverWorkingError: '서버 작업중입니다.',
        needlogin: '로그인이 필요한 서비스입니다.',
    },
    default: {
        notfound: {
            usename: '사용자 이름을 입력해 주세요.',
            email: '이메일을 입력해 주세요.',
            password: '비밀 번호를 입력해 주세요.',
            exitsUser: '사용자가 존재 하지 않습니다.',
        },
        check: {
            email: '이미 사용중인 이메일 주소 입니다.',
            name: '이미 사용중인 사용자 이름 입니다.',
            loginPassword: '비밀 번호가 일치 하지 않습니다.',
            not_found_refresh_token: '토큰 정보가 존재 하지 않습니다.',
            fail_refresh_token: '로그인 정보가 존재 하지 않습니다.',
            fail_refresh_token_revoked: '사용할수 없는 토큰정보 입니다. 다시 로그인해 주세요.',
            fail_refresh_token_access_token: '토큰 정보 조회를 할수 없습니다.',
            fail_refresh_token_user_id: '정상 적인 사용자만 진행 할수 있습니다.',
            login_fail_user_active: '로그인 할수 없는 사용자 입니다.',
            get_user_info_error: '사용자 정보를 가지고오는데 실패 했습니다.',
        },
        success: {
            register: '회원 가입이 완료 되었습니다.',
        },
        validation: {
            user_name: '사용자 이름을 입력해 주세요.',
            profile_intro: '소개를 입력해 주세요.',
        },
    },
};

export { httpStatus, responseStatus, responseMessage };
