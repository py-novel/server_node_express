import getConnection from '../util/db'
import Novel from '../entity/Novel.entity'
import Classify from '../entity/Classify.entity'
import ReptileFactory from '../reptile/ReptileFactory'

export default {

    /**
     * 根据小说分类 ID 从数据库中查询小说列表数据
     * @param classifyId 
     */
    async findNovelsByClassify(classifyId: string) {
        const novelRepository = await this.getNovelRepository()
        const novels = await novelRepository.find({ classify: new Classify(classifyId) })
        return novels
    },

    /**
     * 根据查询关键词从各个源网站查询列表数据
     * @param keyword 
     */
    async findNovelsByKeyword(keyword: string) {
        const novels = await ReptileFactory.getNovelsByKeyword(keyword)
        return novels
    },

    async reptileNovelIntro(targetUrl: string) {
        const reptile = await ReptileFactory.getReptile(targetUrl)
        return reptile?.reptileNovelIntro(targetUrl)
    },

    async reptileNovelContent(targetUrl: string) {
        const reptile = await ReptileFactory.getReptile(targetUrl)
        return reptile.reptileNovelContent(targetUrl)
    },

    async reptileNovelChapter(targetUrl: string) {
        const reptile = await ReptileFactory.getReptile(targetUrl)
        return reptile.reptileChapterList(targetUrl)
    },

    async getNovelRepository() {
        const conn = await getConnection()
        return conn.getRepository(Novel)
    },

}