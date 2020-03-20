import getConnection from '../utils/db'
import Search from '../entity/Search.entity'

export default {

    async findHistsByUserId(userId: string) {
        const searchRepository = await this.getSearchRepository()
        const hists = await searchRepository.createQueryBuilder()
            .select('keyword')
            .where('user_id=:userId')
            .orderBy('lastUpdateAt', 'DESC')
            .take(6)
            .setParameters({ userId })
            .getRawMany()
        return hists
    },

    async findHots() {
        const searchRepository = await this.getSearchRepository()
        const hots = await searchRepository.createQueryBuilder()
            .createQueryBuilder()
            .select('keyword')
            .addSelect('SUM(times)', 'times')
            .groupBy('keyword')
            .orderBy('times', 'DESC')
            .take(6)
            .getRawMany()
        return hots
    },

    async findHotByUserIdAndKeyword(userId: string, keyword: string) {
        const searchRepository = await this.getSearchRepository()
        const hist = await searchRepository.createQueryBuilder()
            .select('keyword')
            .where('user_id=:userId')
            .andWhere('keyword=:keyword')
            .orderBy('lastUpdateAt', 'DESC')
            .take(6)
            .setParameters({ userId, keyword })
            .getRawOne()
        return hist
    },

    async saveSearch(hist: Search) {
        const searchRepository = await this.getSearchRepository()
        return await searchRepository.save(hist)
    },

    async getSearchRepository() {
        const conn = await getConnection()
        return conn.getRepository(Search)
    }
}