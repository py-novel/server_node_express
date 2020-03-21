import getConnection from '../util/db'
import User from '../entity/User.entity'

export default {
    async findOneByUsername(username: string) {
        const userRepository = await this.getUserRepository()
        const user = await userRepository.findOne({ username })
        return user
    },

    async findOneById(id: string) {
        const userRepository = await this.getUserRepository()
        const user = await userRepository.findOne(id)
        return user
    },

    async findOneByUsernameAndPassword(username: string, password: string) {
        const userRepository = await this.getUserRepository()
        const user = await userRepository.findOne({ username, password })
        return user
    },

    async saveUser(u: User) {
        const userRepository = await this.getUserRepository()
        const user = await userRepository.save(u)
        return user
    },

    async updateUser(u: User) {
        const userRepository = await this.getUserRepository()

        let user
        if (u.id) {
            user = await userRepository.findOne(u.id)
        } else if (u.username) {
            user = await userRepository.findOne({ username: u.username })
        } else {
            throw new Error('id 和 username 至少有一个值不能为空')
        }

        if (!user) throw new Error('找不到要修改的用户信息')

        user.nickname = u.nickname || user.nickname
        user.avatarUrl = u.avatarUrl || user.avatarUrl
        user.address = u.address || user.address
        user.gender = u.gender || user.gender
        user = await userRepository.save(user)

        return user
    },

    async getUserRepository() {
        const conn = await getConnection()
        return conn.getRepository(User)
    }
}

