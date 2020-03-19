import getConnection from '../utils/db'
import Novel from '../entity/Novel.entity'
import Classify from '../entity/Classify.entity'

export default {

    async findListByClassify(classifyId: string) {
        const novelRepository = await this.getNovelRepository()
        const novels = await novelRepository.find({ classify: new Classify(classifyId) })
        return novels
    },

    async getNovelRepository() {
        const conn = await getConnection()
        return conn.getRepository(Novel)
    }
}