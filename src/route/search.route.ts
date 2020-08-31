import { Request, Response } from 'express'
import debug from 'debug'
import Search from '../entity/Search.entity'
import User from '../entity/User.entity'
import searchService from '../service/search.service'
import novelService from '../service/novel.service'
import AdminResponse from '../util/AdminResponse'

const log = debug('src/route/search')

export default {
    /**
     * 查询当前用户搜索记录
     */
    listHists: async function (req: Request, res: Response) {
        const { userId } = req.query
        log(`getSearchHist() param of userId: ${userId}`)

        if (!userId) return res.json(AdminResponse.failure('用户ID(userId)不能为空'))

        try {
            const hists = await searchService.listHists(userId)
            res.json(AdminResponse.success(hists))
        } catch (e) {
            log(`getSearchHist() 查询搜索历史失败: ${e.message}`)
            res.json(AdminResponse.failure('查询搜索历史失败'))
        }
    },

    /**
     * 查询热门搜索
     */
    listHots: async function (req: Request, res: Response) {
        try {
            const hots = await searchService.listHots()
            res.json(AdminResponse.success(hots))
        } catch (e) {
            log(`getSearchHot() 查询搜索热门记录失败: ${e.message}`)
            res.json(AdminResponse.failure('查询搜索热门记录失败'))
        }
    },

}