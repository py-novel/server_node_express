import { getManager } from 'typeorm'
import Search from '../entity/Search.entity'
import User from '../entity/User.entity'

export default {

    /**
     * 根据 userId 查询搜索历史记录
     * @param userId 
     */
    async listHists(userId: string) {
        const searchRepository = await getManager().getRepository(Search)
        const hists = await searchRepository.createQueryBuilder()
            .select('keyword')
            .where('user_id=:userId')
            .orderBy('lastUpdateAt', 'DESC')
            .take(6)
            .setParameters({ userId })
            .getRawMany()
        return hists
    },

    /**
     * 查询热门搜索列表
     */
    async listHots() {
        const searchRepository = await getManager().getRepository(Search)
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

    /**
     * 修改查询关键词次数
     */
    async modifySearchTimes(userId: string, keyword: string) {
        // 根据 userId 和 keyword 去搜索表中查数据
        const user = new User()
        user.id = userId

        const searchRepository = await getManager().getRepository(Search)
        let search = await searchRepository.findOne({ user, keyword })

        if (search) {   // 已存在搜索记录，次数 + 1
            search.times = Number(search.times) + 1
        } else {        // 没有搜索记录，添加一条
            search = new Search()
            const user = new User()
            user.id = userId
            search.user = user
            search.keyword = keyword
        }

        await searchRepository.save(search)
    },
}