import { Request, Response } from 'express'
import jwt from '@apacejs/jwt'
import axios from 'axios'
import { wxAppId, wxAppSecret, tokenExpiresIn } from '../config'
import User from '../entity/User.entity'
import userService from '../services/user.service'

export default {
    /**
     * 微信小程序登录接口
     */
    signin: async function (req: Request, res: Response) {
        const { code } = req.body

        if (!code) {
            return res.json({ code: '9999', message: '登录码(code)不能为空', data: {} })
        }

        try {
            const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxAppId}&secret=${wxAppSecret}&js_code=${code}&grant_type=authorization_code`
            const response = await axios.get(url)
            // 获取 openid
            const { openid } = response.data

            // 查询用户信息
            const user = await userService.findOneByUsername(openid)
            const token = jwt.sign({ username: openid }, { expiresIn: tokenExpiresIn })
            // 用户不存在，则新增用户
            if (!user) {
                let newUser = new User()
                newUser.clientType = 'OPENID'
                newUser.username = openid
                newUser.password = openid
                newUser = await userService.saveUser(newUser)
                res.json({
                    code: '0000',
                    message: '获取用户信息成功',
                    data: {
                        userId: newUser.id,
                        openId: openid,
                        token,
                    },
                })
            } else {
                const { id, nickname, avatarUrl } = user
                res.json({
                    code: '0000',
                    message: '获取用户信息成功',
                    data: {
                        userId: id,
                        openId: openid,
                        nickname,
                        avatarUrl,
                        token,
                    },
                })
            }
        } catch (e) {
            console.log('[-] routes > weapp > signin()', e.message)
            res.json({ code: '9999', message: '获取用户信息失败', data: {} })
        }
    },
}