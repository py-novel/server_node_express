import nodemailer from 'nodemailer'
import { emailAccount, emailPass } from '../config'
import Mail from 'nodemailer/lib/mailer'

const transporter = nodemailer.createTransport({//邮件传输
    host: 'smtp.qq.com',                // qq smtp服务器地址
    secure: false,            // 是否使用安全连接，对https协议的
    port: 465,                          // qq邮件服务所占用的端口
    auth: {
        user: emailAccount,            // 开启SMTP的邮箱，有用发送邮件
        pass: emailPass,               // 授权码 
    },
})

const sendEmail = function (mailOption: Mail.Options) {
    return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOption, async function (err: Error | null) {
            if (err) {
                console.log('[-] utils > email > sendEmail()', err.message)
                reject({ code: '9999', message: '发送邮件失败', data: {} })
            }

            resolve({ code: '0000', message: '已发送邮件', data: {} })
        })
    })
}

global.sendEmail = sendEmail

export default {}
