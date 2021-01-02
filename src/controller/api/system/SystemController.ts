import { Request, Response, NextFunction } from 'express';
import GlobalConfig from '@GlobalConfig';
import { DeepMerge } from '@Helper';
import { noCotentResponse, baseNoticeResponse, baseAppversionResponse, baseSuccessResponse } from '@Providers';
import * as fs from 'fs';
import { Codes, Users } from '@Models';
import { sequelize } from '@src/instances/Sequelize';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

// 기본 서버 상태 체크.
export const checkStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req) {
        noCotentResponse(res);
    }

    next();
};

// 서버 공지 사항 체크.
export const checkNotice = async (req: Request, res: Response): Promise<void> => {
    if (req) {
        fs.readFile('storage/server/notice.txt', 'utf8', function(err, notice) {
            if (err || notice === '') {
                noCotentResponse(res);
            } else {
                baseNoticeResponse(res, {
                    notice: notice.trim(),
                });
            }
        });
    }
};

// 앱 버전 체크.
export const appVersionCheck = async (req: Request, res: Response): Promise<void> => {
    if (req) {
        fs.readFile('storage/server/app_version.txt', 'utf8', function(err, appVersion) {
            if (err || appVersion === '') {
                noCotentResponse(res);
            } else {
                baseAppversionResponse(res, {
                    version: appVersion.trim(),
                });
            }
        });
    }
};

// 시스템 기본 데이터
export const baseData = async (req: Request, res: Response): Promise<void> => {
    const codeNameType = {};
    const codeGroupType = {};

    if (req) {
        await Codes.findAll({
            where: {
                active: 'Y',
            },
            attributes: ['id', 'group_id', 'code_id', 'group_name', 'code_name'],
        }).then(function(list) {
            list.filter(e => e.code_id != null).map(function(e) {
                const codeId = typeof e.code_id === 'string' ? e.code_id : '';
                const groupId = typeof e.group_id === 'string' ? e.group_id : '';
                const codeName = e.code_name;

                Object.assign(codeNameType, { [codeId]: codeName });

                DeepMerge(codeGroupType, { [groupId]: { [codeId]: codeName } });
            });

            baseSuccessResponse(res, {
                codes: {
                    code: codeNameType,
                    group: codeGroupType,
                },
            });
        });
    }
};

// 기본 유저 등록.
export const defaultUser = async (req: Request, res: Response): Promise<void> => {
    if (req) {
        const options = { raw: true };
        await sequelize
            .query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return sequelize.query('truncate table users', options);
            })
            .then(function() {
                return sequelize.query('truncate table user_profile', options);
            })
            .then(function() {
                return sequelize.query('truncate table user_email_auth', options);
            })
            .then(function() {
                return sequelize.query('truncate table user_type', options);
            })
            .then(function() {
                return sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options);
            });

        fs.readFile('storage/server/user.json', 'utf8', async function(err, user) {
            const userJson = JSON.parse(user);
            /* eslint-disable @typescript-eslint/camelcase */
            const transaction = await sequelize.transaction();
            try {
                const task = await Users.create(
                    {
                        user_uuid: uuidv4(),
                        user_name: userJson.user_name,
                        user_password: bcrypt.hashSync(userJson.user_password, Number(GlobalConfig.bcrypt_saltrounds)),
                        user_email: userJson.user_email,
                        user_level: userJson.user_level,
                        active: 'Y',
                        profile_active: 'Y',
                    },
                    { transaction }
                );
                // commit
                await transaction.commit();
                baseSuccessResponse(res, task);
            } catch (err) {
                console.log(err);
                await transaction.rollback();
            }
        });
    }
};
