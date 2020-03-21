import QcloudSms from 'qcloudsms_js'
import { mobileAppid, mobileAppkey, mobileSignature, mobileTemplateId } from '../config'
import AdminResponse from '../utils/AdminResponse'
import redis from '../utils/redis'

export default {
    /**
     * 发送短信验证码
     */
    sendVcode: async function ({ mobile }: { mobile: string }) {
        const code = String(Math.random().toFixed(6)).substr(2)    // 验证码
        const deadline = 10        // 在 [deadline] 分钟内填写

        try {
            const result = await this.sendMobileSms(mobile, [code, deadline])

            if (result.code !== '0000') {
                console.log('[-] daos sendVcode()', result)
                return AdminResponse.failure('发送短信验证码失败')
            }

            console.log('短信验证码：', code)
            await redis.hmsetAsync(`user${mobile}`, { mobile: code })
            return AdminResponse.success('已发送短信验证码')
        } catch (e) {
            console.log('[-] daos > mobile > sendVcode()', e.message)
            return AdminResponse.failure('发送短信验证码失败')
        }
    },

    /**
     * 校验短信验证码是否正确
     */
    validateVcode: async function ({ vcode, mobile }: { vcode: string, mobile: string }) {
        try {
            // 从 redis 中读取短信验证码
            const mobileCode = await redis.hgetAsync(`user${mobile}`, 'mobile')
            if (!mobileCode) return AdminResponse.failure('短信校验超时，请重新发送验证码')

            if (mobileCode !== vcode) {
                return AdminResponse.failure('短信校验码输入错误')
            }

            // 校验成功之后要置空校验码值
            await redis.hmsetAsync(`user${mobile}`, { mobile: '' })
            return AdminResponse.success('短信校验码验证成功')
        } catch (e) {
            console.log('[-] daos > mobile > validateVcode()', e.message)
            return AdminResponse.failure('短信校验码验证失败')
        }
    },

    sendMobileSms: function (mobile: string, params: any[] = []): Promise<IResponse> {
        return new Promise(function (resolve, reject) {

            const qcloudsms = QcloudSms(mobileAppid, mobileAppkey)

            const pattern = /^1[3578][0-9]{8}[0-9]$/g
            if (!(new RegExp(pattern).test(mobile))) {
                return reject(AdminResponse.failure('短信验证码发送失败：手机号码格式错误'))
            }
            if (params.length !== 2) {
                return reject(AdminResponse.failure('短信验证码发送失败：短信模板参数传递错误'))
            }

            try {
                const ssender = qcloudsms.SmsSingleSender()
                ssender.sendWithParam(86, mobile, mobileTemplateId,
                    params, mobileSignature, '', '', function callback(err: any, res: any, resData: any) {
                        if (err) {
                            return reject(AdminResponse.failure(`短信验证码发送失败：${err}`))
                        } else {
                            return resolve(AdminResponse.success(resData, '短信验证码发送成功'))
                        }
                    })
            } catch (e) {
                return reject(AdminResponse.failure(`短信验证码发送失败：${e}`))
            }

        })
    }
}