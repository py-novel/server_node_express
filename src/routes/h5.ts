import { Request, Response } from 'express'
import jwt from '@apacejs/jwt'
import { tokenExpiresIn } from '../config'
import User from '../entity/User.entity'
import userService from '../services/user.service'

export default {
    /**
     * h5登录接口
     */
    signin: async function (req: Request, res: Response) {
        const { username } = req.body

        if (!username) {
            return res.json({ code: '9999', message: '用户名(username)不能为空', data: {} })
        }

        try {
            // 查询用户信息
            let user = await userService.findOneByUsername(username)

            // 用户不存在，则新增用户
            if (!user) {
                const newUser = new User()
                newUser.clientType = 'H5'
                newUser.username = username
                newUser.password = username

                // 保存用户
                user = await userService.saveUser(newUser)
            }

            // 获取 token
            const token = jwt.sign({ username }, { expiresIn: tokenExpiresIn })

            res.json({
                code: '0000',
                message: '获取用户信息成功',
                data: {
                    userId: user.id,
                    token,
                }
            })
        } catch (e) {
            console.log('[-] routes > h5 > signin()', e.message)
            res.json({ code: '9999', message: '获取用户信息失败', data: {} })
        }
    }
}