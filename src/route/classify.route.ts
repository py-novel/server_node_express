import { Request, Response } from 'express'
import debug from 'debug'
import classifyService from '../service/classify.service'
import AdminResponse from '../util/AdminResponse'

const log = debug('src/route/classify')

export default {

    /**
     * 查看小说分类
     */
    listClassifies: async function (req: Request, res: Response) {
        try {
            const classifies = await classifyService.listClassifies()
            res.json(AdminResponse.success(classifies))
        } catch (e) {
            log(`listClassifies() 查询小说分类列表失败: ${e.message}`)
            res.json(AdminResponse.failure('查询小说分类列表失败'))
        }
    },

}