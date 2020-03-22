import { getManager } from 'typeorm'
import Audit from '../entity/Audit.entity'

export default {

    async saveAudit(audit: Audit) {
        const auditRepository = await this.getAuditRepository()
        const newAudit = await auditRepository.save(audit)
        return newAudit
    },

    async getAuditRepository() {
        return getManager().getRepository(Audit)
    }
}