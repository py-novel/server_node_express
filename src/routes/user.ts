import { Request, Response } from 'express'
import User from '../entity/User.entity'
import userService from '../service/user.service'

export default {

    updateUser: async function (req: Request, res: Response) {
        const { userId, nickname, avatarUrl, address, gender } = req.body

        if (!userId) {
            return res.json({ code: '9999', message: '用户ID(userId)不能为空', data: {} })
        }

        const params = new User()
        params.id = userId
        params.nickname = nickname
        params.avatarUrl = avatarUrl
        params.address = address
        params.gender = gender

        try {
            const user = await userService.updateUser(params)
            res.json({ code: '0000', message: '操作成功', data: user })
        } catch (e) {
            console.log('[-] routes > user > updateUser()', e.message)
            res.json({ code: '9999', message: '修改用户信息失败', data: {} })
        }
    },

}