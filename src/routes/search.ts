import { Request, Response } from 'express'
import novelDao from '../daos/novel'

import Search from '../entity/Search.entity'
import User from '../entity/User.entity'
import searchService from '../service/search.service'

export default {
    /**
     * 查询当前用户搜索记录
     */
    getSearchHist: async function (req: Request, res: Response) {
        const { userId } = req.query

        if (!userId) {
            return res.json({ code: '0000', message: '用户ID(userId)不能为空', data: [] })
        }

        try {
            const hists = await searchService.findHistsByUserId(userId)
            res.json({ code: '0000', message: '操作成功', data: hists })
        } catch (e) {
            console.log('[-] routes > search > getSearchHist()', e.message)
            res.json({ code: '9999', message: '查询搜索历史记录失败', data: [] })
        }
    },

    /**
     * 查询热门搜索
     */
    getSearchHot: async function (req: Request, res: Response) {
        try {
            const hots = await searchService.findHots()
            res.json({ code: '0000', message: '操作成功', data: hots })
        } catch (e) {
            console.log('[-] routes > search > getSearchHot()', e.message)
            res.json({ code: '9999', message: '查询搜索热门记录失败', data: [] })
        }
    },

    /**
     * 查询小说列表
     * 查询条件：作者名/小说名
     */
    getSearchNovel: async function (req: Request, res: Response) {
        const { keyword, userId } = req.query

        if (!keyword) {
            return res.json({ code: '9999', message: '关键字(keyword)不能为空', data: [] })
        }

        if (!userId) {
            return res.json({ code: '9999', message: '用户ID(userId)不能为空', data: [] })
        }

        let reptileResult
        try {
            reptileResult = await novelDao.reptileNovelList({ keyword })
            res.json(reptileResult)
        } catch (e) {
            console.log('[-] routes > search > getSearchNovel()', e.message)
            res.json({ code: '9999', message: '没有找到小说', data: [] })
        }

        try {
            if (reptileResult && Array.isArray(reptileResult?.data) && reptileResult.data.length > 0) {
                // 根据 userId 和 keyword 去搜索表中查数据
                const hist = await searchService.findHotByUserIdAndKeyword(userId, keyword)
                if (hist) {
                    // 已搜过关键词，更改次数
                    const times = hist.times + 1
                    hist.times = times
                    hist.lastUpdateAt = new Date()
                    await searchService.saveSearch(hist)
                    console.log('更新搜索历史记录成功 userId=%o, keyword=%o', userId, keyword)
                } else {
                    // 未搜过关键词，新增
                    const newSearch = new Search()
                    newSearch.user = new User(userId)
                    newSearch.keyword = keyword
                    newSearch.lastUpdateAt = new Date()
                    await searchService.saveSearch(newSearch)
                    console.log('新增搜索历史记录成功 userId=%o, keyword=%o', userId, keyword)
                }
            }
        } catch (e) {
            console.log('[-] routes > search > getSearchNovel()', e.message)
        }
    },
}