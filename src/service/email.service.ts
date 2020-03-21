import debug from 'debug'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { emailAccount, emailPass } from '../config'
import * as redis from '../util/redis'

const log = debug('src/service/email')

export default {
    /**
     * 发送 email 邮件
     */
    sendEmailCode: async function ({ email, userId }: { email: string; userId: number }) {
        const code = String(Math.random().toFixed(6)).substr(2)
        const mailOption = {
            from: emailAccount,                          // 发件人
            to: email,                           // 收件人
            subject: '【公羊阅读】邮箱验证码',             // 纯文本
            html: `<h3 style="display: inline;">欢迎注册 
                <h1 style="display: inline;">公羊阅读</h1>
                ，您本次的注册验证码为：
                <h1 style="display: inline;">${code}</h1>
            </h3>`,
        }

        const result = await this.sendEmail(mailOption)
        // 保存/更新邮箱校验码
        await redis.setAsync(`email${userId}`, code)
        return result
    },

    /**
     * 校验验证码输入是否正确
     */
    validateEcode: async function ({ code, userId }: { code: string; userId: number }) {
        try {
            // 从 redis 中读取邮箱验证码
            const emailCode = await redis.getAsync(`email${userId}`)
            if (!emailCode) return { code: '9999', message: '邮箱校验超时，请重新发送验证码', data: {} }

            if (emailCode !== code) {
                return { code: '9999', message: '邮箱校验码输入错误', data: {} }
            }

            // 校验成功之后要置空校验码值
            await redis.setAsync(`email${userId}`, '')
            return { code: '0000', message: '邮箱校验码验证成功', data: {} }
        } catch (e) {
            log(`validateEcode() redis读取数据失败: ${e.message}`)
            return { code: '9999', message: 'redis 读取数据失败', data: {} }
        }

    },

    /**
     * 发送用户反馈邮件
     */
    sendFeedbackEmail: async function ({ title, content, userId, email }: { title: string, content: string, userId: number, email: string }) {
        const mailOption = {
            from: emailAccount,                          // 发件人
            to: 'me@dkvirus.com',                        // 收件人
            subject: '【公羊阅读】用户反馈',                // 纯文本
            html: `
                <h1>标题：${title}</h1>
                <p>内容：${content}</p>
                <p>反馈人：${userId}</p>   
                <p>反馈人邮箱：${email}</p>
            `,
        }

        const result = await this.sendEmail(mailOption)
        return result
    },

    sendEmail: function (mailOption: Mail.Options) {
        const transporter = nodemailer.createTransport({//邮件传输
            host: 'smtp.qq.com',                // qq smtp服务器地址
            secure: false,            // 是否使用安全连接，对https协议的
            port: 465,                          // qq邮件服务所占用的端口
            auth: {
                user: emailAccount,            // 开启SMTP的邮箱，有用发送邮件
                pass: emailPass,               // 授权码 
            },
        })

        return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOption, async function (e: Error | null) {
                if (e) {
                    log(`sendEmail() 发送邮件失败: ${e.message}`)
                    reject({ code: '9999', message: '发送邮件失败', data: {} })
                }

                resolve({ code: '0000', message: '已发送邮件', data: {} })
            })
        })
    },
}