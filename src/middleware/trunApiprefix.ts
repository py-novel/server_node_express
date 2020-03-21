import { Request, Response, NextFunction } from 'express'

export default function (apiPrefix: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        req.url = req.url.replace(apiPrefix, '')
        next()
    }
} 