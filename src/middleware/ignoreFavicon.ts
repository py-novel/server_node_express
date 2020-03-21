/**
 * 忽略 favicon.ico 请求
 */

import { Request, Response, NextFunction } from 'express'

export default function () {
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.originalUrl === '/favicon.ico') {
            res.sendStatus(204)
        } else {
            next()
        }
    }
}