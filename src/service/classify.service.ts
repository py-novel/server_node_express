import { getManager } from 'typeorm'
import Classify from '../entity/Classify.entity'

export default {

    async findAll() {
        const classifyRepository = await this.getClassifyRepository()
        const classifies = await classifyRepository.find()
        return classifies
    },

    async getClassifyRepository() {
        return getManager().getRepository(Classify)
    }
}