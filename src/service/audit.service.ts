import { getManager } from 'typeorm'
import Audit from '../entity/Audit.entity'

export default {

    async createAudit(audit: Audit) {
        const auditRepository = await getManager().getRepository(Audit)
        const newAudit = await auditRepository.save(audit)
        return newAudit
    },

}