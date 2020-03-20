import getConnection from '../utils/db'
import Shelf from '../entity/Shelf.entity'
import User from '../entity/User.entity'

export default {
    async findCountByUserIdAndAuthornameAndBookname(userId: string, authorName: string, bookName: string) {
        const shelfRepository = await this.getShelfRepository()
        const count = await shelfRepository.count({ user: new User(userId), authorName, bookName })
        return count
    },

    async findAllByUserId(userId: string) {
        const shelfRepository = await this.getShelfRepository()
        const shelfs = await shelfRepository.find({ user: new User(userId) })
        return shelfs
    },

    async findOneById(id: string) {
        const shelfRepository = await this.getShelfRepository()
        const shelf = await shelfRepository.findOne(id)
        return shelf
    },

    async saveShelf(s: Shelf) {
        const shelfRepository = await this.getShelfRepository()
        const shelf = await shelfRepository.save(s)
        return shelf
    },

    async removeShelf(s: Shelf) {
        const shelfRepository = await this.getShelfRepository()
        return await shelfRepository.remove(s)
    },

    async getShelfRepository() {
        const conn = await getConnection()
        return conn.getRepository(Shelf)
    }
}