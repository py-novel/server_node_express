import { Request, Response } from 'express'
import debug from 'debug'
import shelfService from '../service/shelf.service'
import classifyService from '../service/classify.service'
import novelService from '../service/novel.service'
import AdminResponse from '../util/AdminResponse'

const log = debug('src/route/novel')

export default {
    /**
     * 查询小说内容
     * 更新最新阅读章节
     */
    getNovelContent: async function (req: Request, res: Response) {
        const { url, shelfId } = req.query
        log(`getNovelContent() param of url: ${url} shelfId: ${shelfId}`)

        if (!url) {
            return res.json(AdminResponse.failure('章节地址(url)不能为空'))
        }

        try {
            const result = await novelService.reptileNovelContent(url)
            res.json(AdminResponse.success(result))
        } catch (e) {
            log(`getNovelContent() 查询小说内容信息失败: ${e.message}`)
            res.json(AdminResponse.failure('查询小说内容信息失败'))
        }

        try {
            // 更新小说最新阅读章节
            const shelf = await shelfService.findOneById(shelfId)
            if (shelf) {
                shelf.recentChapterUrl = url
                await shelfService.saveShelf(shelf)
            }
        } catch (e) {
            log(`getNovelContent() 更新小说最新阅读章节失败: ${e.message}`)
        }
    },

    /**
     * 查看小说章节 
     */
    getNovelChapter: async function (req: Request, res: Response) {
        const { url } = req.query
        log(`getNovelChapter() param of url: ${url}`)

        if (!url) {
            return res.json(AdminResponse.failure('章节地址(url)不能为空'))
        }

        try {
            const result = await novelService.reptileNovelChapter(url)
            res.json(AdminResponse.success(result))
        } catch (e) {
            log(`getNovelChapter() 查询小说章节列表信息失败: ${e.message}`)
            res.json(AdminResponse.failure('查询小说章节列表信息失败'))
        }
    },

    /**
     * 查询小说详情 
     */
    getNovelIntro: async function (req: Request, res: Response) {
        const { url } = req.query
        log(`getNovelIntro() param of url: ${url}`)

        if (!url) {
            return res.json(AdminResponse.failure('小说地址(url)不能为空'))
        }

        try {
            const result = await novelService.reptileNovelIntro(url)
            res.json(AdminResponse.success(result))
        } catch (e) {
            log(`getNovelIntro() 查询小说详情信息失败: ${e.message}`)
            res.json(AdminResponse.failure('查询小说详情信息失败'))
        }
    },

    /**
     * 查看小说分类
     */
    getNovelClassify: async function (req: Request, res: Response) {
        try {
            const classifies = await classifyService.findAll()
            res.json(AdminResponse.success(classifies))
        } catch (e) {
            log(`getNovelClassify() 查询小说分类列表失败: ${e.message}`)
            res.json(AdminResponse.failure('查询小说分类列表失败'))
        }
    },

    /**
     * 查询小说列表
     */
    getNovelList: async function (req: Request, res: Response) {
        const { classifyId } = req.query
        log(`getNovelList() param of classifyId: ${classifyId}`)

        try {
            const novels = await novelService.findNovelsByClassify(classifyId)
            res.json(AdminResponse.success(novels))
        } catch (e) {
            log(`getNovelList() 查询小说列表失败: ${e.message}`)
            res.json(AdminResponse.failure('查询小说列表失败'))
        }
    },

}