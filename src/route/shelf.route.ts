import { Request, Response } from 'express'
import debug from 'debug'
import Shelf from '../entity/Shelf.entity'
import User from '../entity/User.entity'
import shelfService from '../service/shelf.service'
import AdminResponse from '../util/AdminResponse'

const log = debug('src/route/shelf')

export default {

    /**
     * 往书架中添加小说
     * 小说介绍页面，添加到书架
     */
    addShelf: async function (req: Request, res: Response) {
        const { userId, authorName, bookName,
            bookDesc, bookCoverUrl, recentChapterUrl } = req.body
        log(`addShelf() param of userId: ${userId} authorName: ${authorName} bookName: ${bookName}
        bookDesc: ${bookDesc} bookCoverUrl: ${bookCoverUrl} recentChapterUrl: ${recentChapterUrl}`)

        if (!userId) {
            return res.json(AdminResponse.failure('书架书籍ID(id)不能为空'))
        }

        if (!authorName) {
            return res.json(AdminResponse.failure('作者名(authorName)不能为空'))
        }

        if (!bookName) {
            return res.json(AdminResponse.failure('书名(bookName)不能为空'))
        }

        if (!recentChapterUrl) {
            return res.json(AdminResponse.failure('最新阅读章节(recentChapterUrl)不能为空'))
        }

        try {
            // 判断书籍是否已存在该用户书架中，避免重复添加
            const count = await shelfService.findCountByUserIdAndAuthornameAndBookname(userId, authorName, bookName)

            if (count > 0) {
                return res.json(AdminResponse.failure('该书籍已在书架中，不可重复添加'))
            }

            // 新增书架书籍
            const shelf = new Shelf()
            shelf.authorName = authorName
            shelf.bookName = bookName
            shelf.bookDesc = bookDesc
            shelf.bookCoverUrl = bookCoverUrl
            shelf.recentChapterUrl = recentChapterUrl
            shelf.user = new User(userId)
            await shelfService.saveShelf(shelf)
            res.json(AdminResponse.success('新增书架书籍成功'))
        } catch (e) {
            log(`addShelf() 新增书架书籍失败: ${e.message}`)
            res.json(AdminResponse.failure('新增书架书籍失败'))
        }
    },

    /**
     * 删除书架中的小说
     * 小说书架页面，删除书架中的一本书
     */
    removeShelf: async function (req: Request, res: Response) {
        const { id } = req.body
        log(`removeShelf() param of id: ${id}`)

        if (!id) {
            return res.json(AdminResponse.failure('书架书籍ID(id)不能为空'))
        }

        try {
            const shelf = await shelfService.findOneById(id)
            if (shelf) {
                await shelfService.removeShelf(shelf)
                res.json(AdminResponse.success('删除书架书籍信息成功'))
            } else {
                res.json(AdminResponse.failure('删除书架书籍信息失败'))
            }
        } catch (e) {
            log(`removeShelf() 删除书架书籍信息失败: ${e.message}`)
            res.json(AdminResponse.failure('删除书架书籍信息失败'))
        }
    },

    /**
     * 更新书架小说最新阅读章节
     */
    editShelf: async function (req: Request, res: Response) {
        const { id } = req.params
        const { recentChapterUrl } = req.body
        log(`editShelf() param of id: ${id} recentChapterUrl: ${recentChapterUrl}`)

        if (!recentChapterUrl) {
            return res.json(AdminResponse.failure('最新阅读章节地址(recentChapterUrl)不能为空'))
        }

        try {
            const shelf = await shelfService.findOneById(id)
            if (shelf) {
                shelf.recentChapterUrl = recentChapterUrl
                await shelfService.saveShelf(shelf)
                res.json(AdminResponse.success('更新书架书籍信息成功'))
            } else {
                res.json(AdminResponse.failure('更新书架书籍信息失败'))
            }
        } catch (e) {
            log(`editShelf() 更新书架书籍信息失败: ${e.message}`)
            res.json(AdminResponse.failure('更新书架书籍信息失败'))
        }
    },

    /**
     * 查询书架列表
     * userId 小说书架页面，根据用户 ID 查询拥有的书籍
     * userId、bookName、authorName 小说介绍页面，判断图书是否已加入书架，避免重复添加
     */
    getShelfList: async function (req: Request, res: Response) {
        const { userId = '' } = req.query
        log(`getShelfList() param of userId: ${userId}`)

        if (!userId) {
            return res.json(AdminResponse.failure('用户ID(userId)不能为空'))
        }

        try {
            const shelfs = await shelfService.findAllByUserId(userId)
            res.json(AdminResponse.success(shelfs))
        } catch (e) {
            log(`getShelfList() 获取书架书籍列表失败: ${e.message}`)
            res.json(AdminResponse.failure('获取书架列表失败'))
        }
    },
}