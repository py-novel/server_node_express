import { Request, Response } from 'express'
import debug from 'debug'
import jwt from '@apacejs/jwt'
import { tokenExpiresIn } from '../config'
import User from '../entity/User.entity'
import userService from '../service/user.service'
import AdminResponse from '../util/AdminResponse'

const log = debug('src/route/h5')

export default {
    /**
     * h5登录接口
     */
    signin: async function (req: Request, res: Response) {
        const { username } = req.body
        log(`signin() param of username: ${username}`)

        if (!username) {
            return res.json(AdminResponse.failure('用户名(username)不能为空'))
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
            res.json(AdminResponse.success({ userid: user.id, token }, '获取用户信息成功'))
        } catch (e) {
            log(`signin() 获取用户信息失败: ${e.message}`)
            res.json(AdminResponse.failure('获取用户信息失败'))
        }
    }
}