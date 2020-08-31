import { Request, Response } from 'express'
import debug from 'debug'
import jwt from '@apacejs/jwt'
import axios from 'axios'
import userService from '../service/user.service'
import { wxAppId, wxAppSecret, tokenExpiresIn } from '../config'
import AdminResponse from '../util/AdminResponse'

const log = debug('src/route/oauth')

export default {
    /**
     * 登录，拿 token
     * @param username
     * @param password
     * @return { token, expire  }
     */
    async login(req: Request, res: Response) {
        const { username, password } = req.body
        log(`login() param of username: ${username}, password: ${password}`)

        if (!username) return res.json(AdminResponse.failure('用户名不能为空'))
        if (!password) return res.json(AdminResponse.failure('密码不能为空'))

        try {
            const user = await userService.findUser(username, password)
            const { id, nickname, avatarUrl } = user
            const token = jwt.sign({ id }, { expiresIn: tokenExpiresIn })
            res.json(AdminResponse.success({
                userId: id,
                nickname,
                avatarUrl,
                token,
                expire: tokenExpiresIn,     // 单位：秒
            }, '登录成功'))
        } catch (e) {
            log(`login() 登录失败: ${e.message}`)
            res.json(AdminResponse.failure('登录失败'))
        }
    },

    /**
     * 注册
     */
    async register(req: Request, res: Response) {
        const { username, password } = req.body
        log(`register() param of username: ${username}, password: ${password}`)

        if (!username) return res.json(AdminResponse.failure('用户名不能为空'))
        if (!password) return res.json(AdminResponse.failure('密码不能为空'))

        try {
            const user = await userService.createUser(username, password)
            const { id, nickname, avatarUrl } = user
            const token = jwt.sign({ id }, { expiresIn: tokenExpiresIn })
            res.json(AdminResponse.success({
                userId: id,
                nickname,
                avatarUrl,
                token,
                expire: tokenExpiresIn,     // 单位：秒
            }, '注册成功'))
        } catch (e) {
            log(`register() 注册失败: ${e.message}`)
            res.json(AdminResponse.failure('注册失败'))
        }
    },

    /**
     * 重置密码
     */
    async resetPw(req: Request, res: Response) {

    },

    /**
     * 查询微信小程序openid
     */
    async findWeappOpenid(req: Request, res: Response) {
        const { code } = req.body
        log(`findWeappOpenid() param of code: ${code}`)

        if (!code) return res.json(AdminResponse.failure('登录码(code)不能为空'))

        try {
            const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxAppId}&secret=${wxAppSecret}&js_code=${code}&grant_type=authorization_code`
            const response = await axios.get(url)
            const { openid } = response.data            // 获取 openid
            res.json(AdminResponse.success({ openid }))
        } catch (e) {
            log(`findWeappOpenid() 获取小程序 openid 失败: ${e.message}`)
            res.json(AdminResponse.failure('获取小程序 openid 失败'))
        }
    },

}