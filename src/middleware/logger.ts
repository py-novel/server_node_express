/**
 * 日志中间件。
 * 
 * 打印：
 * 【请求时间】【请求方法】【请求地址】
 * 【请求参数】
 */

import { Request, Response, NextFunction } from 'express'

function print(m: string) { console.log(m); return print; }

export default function () {
    return (req: Request, res: Response, next: NextFunction) => {
        print
            (`${new Date().toLocaleString()}【${req.method}  ${req.originalUrl}】`)
            (`请求参数(req.query)：${JSON.stringify(req.query)}`)
            (`请求参数(req.body)：${JSON.stringify(req.body)}`)

        next()
    }
}