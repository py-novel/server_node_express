import getConnection from '../utils/db'
import Classify from '../entity/Classify.entity'

export default {

    async findAll() {
        const classifyRepository = await this.getClassifyRepository()
        const classifies = await classifyRepository.find()
        return classifies
    },

    async getClassifyRepository() {
        const conn = await getConnection()
        return conn.getRepository(Classify)
    }
}