import { getManager } from 'typeorm'
import Classify from '../entity/Classify.entity'

export default {

    async listClassifies() {
        const classifyRepository = await getManager().getRepository(Classify)
        const classifies = await classifyRepository.find()
        return classifies
    },

}