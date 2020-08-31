import { getManager } from 'typeorm'
import Shelf from '../entity/Shelf.entity'
import User from '../entity/User.entity'

export default {
    async createShelf(userId: string, bookName: string, authorName: string, recentChapterUrl: string) {
        // 判断书架是否已存在该书籍，存在就不再重复添加
        const user = new User()
        user.id = userId
        const shelfRepository = await getManager().getRepository(Shelf)
        const count = await shelfRepository.count({ user, bookName, authorName })
        if (count > 0) throw new Error('该书籍已添加到书架，不能重复添加')

        // 新增书架
        let shelf = new Shelf()
        shelf.authorName = authorName
        shelf.bookName = bookName
        shelf.user = user
        shelf.recentChapterUrl = recentChapterUrl
        shelf = await shelfRepository.save(shelf)
        return { id: shelf.id }
    },

    async removeShelf(id: string) {
        const shelfRepository = await getManager().getRepository(Shelf)
        const shelf = new Shelf()
        shelf.id = id
        return await shelfRepository.remove(shelf)
    },

    async modifyShelfRecentChapterUrl(id: string, url: string) {
        const shelfRepository = await getManager().getRepository(Shelf)
        let shelf = await shelfRepository.findOne(id)
        if (!shelf) throw new Error('书架书籍信息不存在')
        shelf.recentChapterUrl = url
        return await shelfRepository.save(shelf)
    },

    async listShelves(userId: string) {
        const shelfRepository = await getManager().getRepository(Shelf)
        const user = new User()
        user.id = userId
        return await shelfRepository.find({ user })
    },
}