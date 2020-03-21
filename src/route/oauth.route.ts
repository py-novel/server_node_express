import { Request, Response } from 'express'
import jwt from '@apacejs/jwt'
import { tokenExpiresIn } from '../config'
import User from '../entity/User.entity'
import userService from '../service/user.service'
import mobileService from '../service/mobile.service'
import AdminResponse from '../util/AdminResponse'

export default {
    /**
     * 拿token
     */
    getToken: async function (req: Request, res: Response) {
        const { userId } = req.query

        if (!userId) {
            return res.json(AdminResponse.failure('用户名ID(userId)不能为空'))
        }

        try {
            const user = await userService.findOneById(userId)

            if (user) {
                const username = user.username
                const token = jwt.sign({ username }, { expiresIn: tokenExpiresIn })
                res.json(AdminResponse.success({ token }))
            } else {
                res.json(AdminResponse.failure('获取token失败'))
            }
        } catch (e) {
            console.log('[-] routes getToken()', e.message)
            res.json(AdminResponse.failure('获取token失败'))
        }
    },

    /**
     * 登录，查询用户
     */
    signin: async function (req: Request, res: Response) {
        const { username, password } = req.body

        // 校验参数必填
        if (!username || !password) {
            return res.json(AdminResponse.failure('用户名和密码不能为空'))
        }

        try {
            // 根据手机号和密码查询用户信息
            const user = await userService.findOneByUsernameAndPassword(username, password)

            if (user) {
                // jwt 生成 token 返回给用户
                const token = jwt.sign({ username }, { expiresIn: tokenExpiresIn })
                const { id, nickname, avatarUrl } = user
                return res.json(AdminResponse.success({
                    userId: id,
                    nickname,
                    avatarUrl,
                    token,
                }, '登录成功'))
            }

            res.json(AdminResponse.failure('用户名或密码错误'))
        } catch (e) {
            console.log('[-] routes signin()', e.message)
            res.json(AdminResponse.failure('登录失败'))
        }
    },

    /**
     * 注册，新增用户
     */
    signup: async function (req: Request, res: Response) {
        const { username, password, vcode } = req.body

        // 校验参数是否必填以及格式是否正确
        if (!username) {
            return res.json(AdminResponse.failure('手机号不能为空'))
        } else if (String(username).length !== 11 || !(/^1[34578]\d{9}$/.test(String(username)))) {
            return res.json(AdminResponse.failure('手机号格式不正确'))
        }

        if (!password) {
            return res.json(AdminResponse.failure('密码不能为空'))
        }

        if (!vcode) {
            return res.json(AdminResponse.failure('短信验证码不能为空'))
        }

        try {
            // 根据手机号去用户表拿数据，手机号必须没有注册过的，才能进行注册
            const user = await userService.findOneByUsername(username)
            if (user) {
                return res.json(AdminResponse.failure('手机号已注册，请直接登录'))
            }

            // 校验验证码是否正确
            const vcodeResult = await mobileService.validateVcode({ vcode, mobile: username })
            // 验证码不正确，返回提示文字
            if (vcodeResult.code !== '0000') {
                return res.json(vcodeResult)
            }

            // 验证码正确，新增一条用户信息
            let newUser = new User()
            newUser.username = username
            newUser.password = password
            newUser.clientType = 'MOBILE'
            newUser = await userService.saveUser(newUser)
            res.json(AdminResponse.success({ userId: newUser.id }, '注册成功'))
        } catch (e) {
            console.log('[-] routes signup()', e.message)
            res.json(AdminResponse.failure('注册失败'))
        }
    },

    /**
     * 重置密码，修改用户
     */
    resetpw: async function (req: Request, res: Response) {
        const { username, password, vcode } = req.body

        // 校验参数是否必填以及格式是否正确
        if (!username) {
            return res.json(AdminResponse.failure('手机号不能为空'))
        } else if (String(username).length !== 11 || !(/^1[34578]\d{9}$/.test(String(username)))) {
            return res.json(AdminResponse.failure('手机号格式不正确'))
        }

        if (!password) {
            return res.json(AdminResponse.failure('密码不能为空'))
        }

        if (!vcode) {
            return res.json(AdminResponse.failure('短信验证码不能为空'))
        }

        try {
            // 根据手机号去用户表拿数据，重置密码要求手机号必须已经注册过，才能改密码
            const user = await userService.findOneByUsername(username)

            if (!user) {
                return res.json(AdminResponse.failure('手机号未注册，请先注册新用户'))
            }

            // 校验验证码是否正确
            const vcodeResult = await mobileService.validateVcode({ vcode, mobile: username })
            // 验证码不正确，返回提示文字
            if (vcodeResult.code !== '0000') {
                return res.json(vcodeResult)
            }

            // 验证码输入正确，修改用户密码
            user.password = password
            await userService.saveUser(user)
            res.json(AdminResponse.success('重置密码成功'))
        } catch (e) {
            console.log('[-] routes resetpw()', e.message)
            res.json(AdminResponse.failure('重置密码失败'))
        }
    },

    /**
     * 发送短信验证码
     * type: 'signup' | 'resetpw'
     */
    sendVcode: async function (req: Request, res: Response) {
        const { username, type } = req.body

        // 校验参数必填
        if (!username) {
            return res.json(AdminResponse.failure('手机号必填'))
        } else if (String(username).length !== 11 || !(/^1[34578]\d{9}$/.test(String(username)))) {
            return res.json(AdminResponse.failure('手机号格式不正确'))
        }

        if (!type) {
            return res.json(AdminResponse.failure('功能类型不能为空'))
        }

        try {
            // 根据手机号去用户表拿数据
            const user = await userService.findOneByUsername(username)

            // type=“signup” 注册时要求之前没有往用户表插过手机号
            if (type === 'signup' && user) {
                return res.json(AdminResponse.failure('手机号已注册，请直接登录'))
            }

            // type="resetpw" 重置密码要求之前已经往用户表插过手机号
            if (type === 'resetpw' && !user) {
                return res.json(AdminResponse.failure('手机号未注册，请先注册新用户'))
            }

            // 发送短信验证码，返回响应
            const vcodeResult = await mobileService.sendVcode({ mobile: username })
            res.json(vcodeResult)
        } catch (e) {
            console.log('[-] routes sendVcode()', e.message)
            res.json(AdminResponse.failure('发送验证码失败'))
        }
    },
}