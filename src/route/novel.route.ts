import { Request, Response } from 'express'
import debug from 'debug'
import shelfService from '../service/shelf.service'
import novelService from '../service/novel.service'
import AdminResponse from '../util/AdminResponse'

const log = debug('src/route/novel')

export default {
    /**
     * 查询小说内容
     * 更新最新阅读章节
     */
    async findNovelContent(req: Request, res: Response) {
        const { url, shelfId } = req.query
        log(`findNovelContent() param of url: ${url} shelfId: ${shelfId}`)

        if (!url) return res.json(AdminResponse.failure('章节地址(url)不能为空'))

        try {
            const result = await novelService.reptileNovelContent(url)
            res.json(AdminResponse.success(result))
        } catch (e) {
            log(`findNovelContent() 查询小说内容信息失败: ${e.message}`)
            res.json(AdminResponse.failure('查询小说内容信息失败'))
        }

        try {
            // 更新小说最新阅读章节
            const shelf = await shelfService.modifyShelfRecentChapterUrl(shelfId, url)
        } catch (e) {
            log(`findNovelContent() 更新小说最新阅读章节失败: ${e.message}`)
        }
    },

    /**
     * 查询小说详情 
     */
    findNovelIntro: async function (req: Request, res: Response) {
        const { url } = req.query
        log(`findNovelIntro() param of url: ${url}`)

        if (!url) return res.json(AdminResponse.failure('小说地址(url)不能为空'))

        try {
            const result = await novelService.reptileNovelIntro(url)
            res.json(AdminResponse.success(result))
        } catch (e) {
            log(`findNovelIntro() 查询小说详情信息失败: ${e.message}`)
            res.json(AdminResponse.failure('查询小说详情信息失败'))
        }
    },

    /**
     * 查看小说章节 
     */
    listNovelChapters: async function (req: Request, res: Response) {
        const { url } = req.query
        log(`listNovelChapters() param of url: ${url}`)

        if (!url) return res.json(AdminResponse.failure('章节地址(url)不能为空'))

        try {
            const result = await novelService.reptileNovelChapter(url)
            res.json(AdminResponse.success(result))
        } catch (e) {
            log(`listNovelChapters() 查询小说章节列表信息失败: ${e.message}`)
            res.json(AdminResponse.failure('查询小说章节列表信息失败'))
        }
    },

    /**
     * 查询小说列表
     * 第一种方式：根据关键词查小说列表，爬虫获取
     * 第二种方式：根据分类id查小说列表，从库里查
     */
    listNovels: async function (req: Request, res: Response) {
        const { classifyId, keyword } = req.query
        const { userId } = req.jwt
        log(`listNovels() param of classifyId: ${classifyId}, keyword: ${keyword}`)

        if (!classifyId && !keyword) return res.json(AdminResponse.failure('请输入查询条件'))

        try {
            const novels = await novelService.listNovels({ userId, classifyId, keyword }) || []
            res.json(AdminResponse.success(novels))
        } catch (e) {
            log(`listNovels() 查询小说列表失败: ${e.message}`)
            res.json(AdminResponse.failure('查询小说列表失败'))
        }
    },

}