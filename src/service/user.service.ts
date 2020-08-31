import { getManager } from 'typeorm'
import User from '../entity/User.entity'

export default {
    async createUser(username: string, password: string) {
        const userRepository = await getManager().getRepository(User)
        let user = new User()
        user.username = username
        user.password = password
        user = await userRepository.save(user)
        return user
    },

    async findUser(username: string, password: string) {
        const userRepository = await getManager().getRepository(User)
        const user = await userRepository.findOne({ username, password })
        if (!user) throw new Error('用户不存在')
        return user
    },

}

