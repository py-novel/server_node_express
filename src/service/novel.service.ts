import { getManager } from 'typeorm'
import debug from 'debug'
import Novel from '../entity/Novel.entity'
import Classify from '../entity/Classify.entity'
import ReptileFactory from '../reptile/ReptileFactory'
import searchService from './search.service'

const log = debug('src/services/novel')

export default {

    /**
     * 查询小说列表
     * @param classifyId 根据分类查小说列表
     * @param keyword 根据关键词查小说列表 
     */
    async listNovels({ classifyId, keyword, userId }: { classifyId?: string; keyword?: string; userId?: string }) {
        const novelRepository = await getManager().getRepository(Novel)

        if (classifyId) {   // 根据分类从库里查数据
            const classify = new Classify()
            classify.id = classifyId
            return await novelRepository.find({ classify })
        }

        if (keyword && userId) {    // list novels by keyword
            const novels = await ReptileFactory.getNovelsByKeyword(keyword)

            try {
                if (novels && Array.isArray(novels) && novels.length > 0) {
                    await searchService.modifySearchTimes(userId, keyword)
                }
            } catch (e) {
                log(`listNovels() 更新搜索关键词次数失败: ${e.message}`)
            }

            return novels
        }
    },

    async reptileNovelIntro(targetUrl: string) {
        const reptile = await ReptileFactory.getReptile(targetUrl)
        return reptile.reptileNovelIntro(targetUrl)
    },

    async reptileNovelContent(targetUrl: string) {
        const reptile = await ReptileFactory.getReptile(targetUrl)
        return reptile.reptileNovelContent(targetUrl)
    },

    async reptileNovelChapter(targetUrl: string) {
        const reptile = await ReptileFactory.getReptile(targetUrl)
        return reptile.reptileChapterList(targetUrl)
    },

}