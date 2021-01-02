import Users from '@src/models/Users';

declare global {
    namespace Express {
        export interface User extends Users {}
    }
}
