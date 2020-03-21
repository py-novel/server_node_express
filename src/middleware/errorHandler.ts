import HttpStatus from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'

export interface IError {
    status?: number;
    code?: number;
    message?: string;
}

export function notFoundErrorHandler() {
    return function (req: Request, res: Response, next: NextFunction) {
        res.status(HttpStatus.NOT_FOUND)
            .json({
                code: HttpStatus.NOT_FOUND,
                message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
            });
    }
}

export function errorHandler() {
    return function (err: IError, req: Request, res: Response, next: NextFunction) {
        res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                code: err.code || HttpStatus.INTERNAL_SERVER_ERROR,
                message: err.message || HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
            });
    }
}