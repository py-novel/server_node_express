import { Request, Response } from 'express'
import debug from 'debug'
import User from '../entity/User.entity'
import userService from '../service/user.service'
import AdminResponse from '../util/AdminResponse'

const log = debug('src/route/user')

export default {

    updateUser: async function (req: Request, res: Response) {
        const { userId, nickname, avatarUrl, address, gender } = req.body
        log(`updateUser() param of userId: ${userId} nickname: ${nickname} avatarUrl: ${avatarUrl} 
        address: ${address} gender: ${gender}`)

        if (!userId) {
            return res.json(AdminResponse.failure('用户ID(userId)不能为空'))
        }

        const params = new User()
        params.id = userId
        params.nickname = nickname
        params.avatarUrl = avatarUrl
        params.address = address
        params.gender = gender

        try {
            const user = await userService.updateUser(params)
            res.json(AdminResponse.success(user))
        } catch (e) {
            log(`updateUser() 修改用户信息失败: ${e.message}`)
            res.json(AdminResponse.failure('修改用户信息失败'))
        }
    },

}