/**
 * 日志中间件。
 * 
 * 打印：
 * 【请求时间】【请求方法】【请求地址】
 * 【请求参数】
 */
import { Request, Response, NextFunction } from 'express'
import debug from 'debug'
import Audit from '../entity/Audit.entity'
import auditService from '../service/audit.service'

const log = debug('src/middleware/logger')

export default function () {
    return async (req: Request, res: Response, next: NextFunction) => {
        const audit = new Audit()
        audit.method = req.method
        audit.url = req.url
        audit.requestTime = new Date()
        audit.body = JSON.stringify(req.body)
        audit.query = JSON.stringify(req.query)
        audit.params = JSON.stringify(req.params)
        log(`createAudit() param of audit: ${JSON.stringify(audit)}`)

        try {
            await auditService.createAudit(audit)
        } catch (e) {
            log(`createAudit() 审计日志创建失败: ${e.message}`)
        } finally {
            next()
        }
    }
}