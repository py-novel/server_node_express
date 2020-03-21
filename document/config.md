
### 配置

创建 src/config.ts 文件，内容如下：
（我的配置文件中包含个人数据库敏感信息，因此没有上传）

``` ts
/**
 * 通用配置
 */
export const apiPrefix = '/api/v3'                      // 请求前缀
export const serverPort = 4000                          // 监听端口

/**
 * jwt 参数
 */
export const tokenExpiresIn = 3600 * 24 * 30            // token 过期时间
export const whiteList = [                              // 请求接口白名单
    { url: '/gysw/oauth/signin' },
    { url: '/gysw/oauth/signup' },
    { url: '/gysw/oauth/resetpw' },
    { url: '/gysw/oauth/vcode' },
    { url: '/gysw/weapp/signin' },
    { url: '/gysw/oauth/wxsignin' },
    { url: '/gysw/oauth/h5signin' },
]

/**
 * 连接数据库参数
 */
export const dbHost = '127.0.0.1'
export const dbUser = 'root'
export const dbPassword = ''
export const dbDatabase = 'novel'

/**
 * 发送邮件必要参数
 * 使用 nodemailer 工具包，示例参考：https://segmentfault.com/a/1190000012251328
 * 发邮件具体代码写在 utils/email.js 和 routes/email.js
 */
export const emailAccount = 'xxxxx@qq.com'
export const emailPass = 'yfysdcwwcrjpbcjb'

/**
 * 发送手机短信必要参数
 * 使用的是腾讯云的短信服务，一个月免费有 500 条短信
 * 参数含义参照官方接口文档：https://cloud.tencent.com/document/product/382/3772
 */
export const mobileAppid = 140333333
export const mobileAppkey = '970eb07499d647fasfa3e17bd7e57c7498'
export const mobileSignature = '公羊阅读'                                // 短信签名
export const mobileTemplateId = 211110                                 // 短信模板ID

/**
 * 获取微信openId必要参数
 */
export const wxAppId = 'wx5312832809cd0743'                           // 微信 appId
export const wxAppSecret = 'dcbaf1fasf0228b1dfadsf6acbe78850'         // 微信 appSecret
```