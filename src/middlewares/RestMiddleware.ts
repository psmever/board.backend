import { Request, Response, NextFunction } from 'express';

export const RestMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    next();
};
