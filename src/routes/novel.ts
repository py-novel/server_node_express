import { Request, Response } from 'express'

import shelfService from '../service/shelf.service'
import classifyService from '../service/classify.service'
import novelService from '../service/novel.service'

export default {
    /**
     * 查询小说内容
     * 更新最新阅读章节
     */
    getNovelContent: async function (req: Request, res: Response) {
        const { url, shelfId } = req.query

        if (!url) {
            return res.json({ code: '9999', message: '章节地址(url)不能为空', data: {} })
        }

        try {
            const result = await novelService.reptileNovelContent(url)
            res.json({ code: '0000', message: '操作成功', data: result })
        } catch (e) {
            console.log('[-] routes > novel > getNovelContent()', e.message)
            res.json({ code: '9999', message: '查询小说内容信息失败', data: [] })
        }

        try {
            // 更新小说最新阅读章节
            const shelf = await shelfService.findOneById(shelfId)
            if (shelf) {
                shelf.recentChapterUrl = url
                await shelfService.saveShelf(shelf)
            }
        } catch (e) {
            console.log('[-] routes > novel > getNovelContent()', e.message)
        }
    },

    /**
     * 查看小说章节 
     */
    getNovelChapter: async function (req: Request, res: Response) {
        const { url } = req.query

        if (!url) {
            return res.json({ code: '9999', message: '章节地址(url)不能为空', data: {} })
        }

        try {
            const result = await novelService.reptileNovelChapter(url)
            res.json({ code: '0000', message: '操作成功', data: result })
        } catch (e) {
            console.log('[-] routes > novel > getNovelChapter()', e.message)
            res.json({ code: '9999', message: '查询小说章节列表信息失败', data: [] })
        }
    },

    /**
     * 查询小说详情 
     */
    getNovelIntro: async function (req: Request, res: Response) {
        const { url } = req.query

        if (!url) {
            return res.json({ code: '9999', message: '小说地址(url)不能为空', data: {} })
        }

        try {
            const result = await novelService.reptileNovelIntro(url)
            res.json({ code: '0000', message: '操作成功', data: result })
        } catch (e) {
            console.log('[-] routes > novel > getNovelIntro()', e.message)
            res.json({ code: '9999', message: '查询小说详情信息失败', data: {} })
        }
    },

    /**
     * 查看小说分类
     */
    getNovelClassify: async function (req: Request, res: Response) {
        try {
            const classifies = await classifyService.findAll()
            res.json({ code: '0000', message: '操作成功', data: classifies })
        } catch (e) {
            console.log('[-] routes > novel > getNovelClassify()', e.message)
            res.json({ code: '9999', message: '查询小说分类列表失败', data: [] })
        }
    },

    /**
     * 查询小说列表
     */
    getNovelList: async function (req: Request, res: Response) {
        const { classifyId } = req.query

        try {
            const novels = await novelService.findNovelsByClassify(classifyId)
            res.json({ code: '0000', message: '操作成功', data: novels })
        } catch (e) {
            console.log('[-] routes > novel > getNovelList()', e.message)
            res.json({ code: '9999', message: '查询小说列表失败', data: [] })
        }
    },

}