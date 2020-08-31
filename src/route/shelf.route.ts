import { Request, Response } from 'express'
import debug from 'debug'
import shelfService from '../service/shelf.service'
import AdminResponse from '../util/AdminResponse'

const log = debug('src/route/shelf')

export default {

    /**
     * 往书架中添加小说
     * 小说介绍页面，添加到书架
     */
    async createShelf(req: Request, res: Response) {
        const { bookName, authorName, recentChapterUrl } = req.body
        const { userId } = req.jwt

        if (!bookName) return res.json(AdminResponse.failure('书名(bookName)不能为空'))
        if (!authorName) return res.json(AdminResponse.failure('作者名(authorName)不能为空'))
        if (!recentChapterUrl) return res.json(AdminResponse.failure('最新阅读章节(recentChapterUrl)不能为空'))

        try {
            await shelfService.createShelf(userId, bookName, authorName, recentChapterUrl)
            res.json(AdminResponse.success('新增书架书籍成功'))
        } catch (e) {
            log(`createShelf() 新增书架书籍失败: ${e.message}`)
            res.json(AdminResponse.failure('新增书架书籍失败'))
        }
    },

    /**
     * 删除书架中的小说
     * 小说书架页面，删除书架中的一本书
     */
    removeShelf: async function (req: Request, res: Response) {
        const { id } = req.params
        log(`removeShelf() param of id: ${id}`)

        if (!id) return res.json(AdminResponse.failure('书架书籍ID(id)不能为空'))

        try {
            await shelfService.removeShelf(id)
            res.json(AdminResponse.success('删除书架书籍信息成功'))
        } catch (e) {
            log(`removeShelf() 删除书架书籍信息失败: ${e.message}`)
            res.json(AdminResponse.failure('删除书架书籍信息失败'))
        }
    },

    /**
     * 查询书架列表
     * userId 小说书架页面，根据用户 ID 查询拥有的书籍
     */
    listShelves: async function (req: Request, res: Response) {
        const { userId } = req.jwt

        try {
            const shelves = await shelfService.listShelves(userId)
            res.json(AdminResponse.success(shelves))
        } catch (e) {
            log(`listShelves() 获取书架书籍列表失败: ${e.message}`)
            res.json(AdminResponse.failure('获取书架书籍列表失败'))
        }
    },
}