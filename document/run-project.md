要把服务端跑起来：

- src 目录下创建 `config.js`，按照下面说明添加相关配置；
- 启动 redis，通常命令是 `$ redis-server`；
  做发短信和发邮件时用到了 redis 依赖，需要先启动；或者将 src/app.js 中导入 redis 那一行代码删掉就可以不启动 redis 了
- 启动项目 `$ npm run dev`；
- 可选：导入数据库脚本。server_node_express/novel.sql

`config.js` 文件，主要是连接数据库的参数，dk 由于使用自己的数据库将该文件忽略上传了，本地启动服务时需要自己添加该文件。

有些接口本地用不上的，可以暂时注释相关配置。如发邮件的接口、发短信的接口、请求微信用户信息的接口。

jwt 配置建议打开，之前 dk 就因为没有做接口认证，导致数据库数据被恶意删除。参见 [issue#23](https://github.com/dkvirus/py-novel/issues/23)

```
/**
 * 通用配置
 */
exports.apiPrefix = '/api/v1';        // 请求前缀
exports.serverPort = 4000;           // 监听端口

/**
 * 连接数据库参数
 */
exports.dbHost = 数据库地址;           // 本地就是 localhost，云主机就是对应 ip
exports.dbUser = 数据库登录用户名;
exports.dbPassword = 数据库登录用户需要的密码;
exports.dbDatabase = 使用哪个数据库;

/**
 * jwt 开放接口
 * tokenExUrl        不做认证的接口
 * tokenExMethod     不做认证的请求方法
 */
exports.tokenSecret = 'qunimade';              // token 密钥
exports.tokenExpiresIn = 10080;                // token 过期时间
exports.tokenExUrl = [                         // 不做认证的接口
  '/gysw/oauth/token',        
  '/gysw/user/info',
  '/gysw/user/validate',
  '/gysw/mobile/code',
  '/gysw/mobile/validate',
];
exports.tokenExMethod = ['GET'];               // 不做认证的请求方法

/**
 * 发送邮件必要参数
 * 使用 nodemailer 工具包，示例参考：https://segmentfault.com/a/1190000012251328
 * 发邮件具体代码写在 utils/email.js 和 routes/email.js
 */
// exports.emailAccount = 邮箱账号;
// exports.emailPass = 邮箱密码;

/**
 * 发送手机短信必要参数
 * 使用的是腾讯云的短信服务，一个月免费有 500 条短信
 * 参数含义参照官方接口文档：https://cloud.tencent.com/document/product/382/3772
 */
// exports.mobileAppid = 短信AppId;
// exports.mobileAppkey = 短信AppKey;
// exports.mobileSignature = 短信签名;                                
// exports.mobileTemplateId = 短信模板ID;          

/**
 * 获取微信openId必要参数
 */
// exports.wxAppId = 微信AppId;                          
// exports.wxAppSecret = 微信AppSecret;       
```

### 接口

假设上面👆的配置中 `apiPrefix=/api/v1`，端口 `serverPort=4000`，启动之后本机访问接口为：

#### 测试接口

- `GET http://localhost:4000/api/v1` 测试接口，返回 hello world 表示启动成功 

#### 书架相关接口

- `GET http://localhost:4000/api/v1/gysw/shelf` 查询书架中所有小说
- `POST http://localhost:4000/api/v1/gysw/shelf` 往书架中新增一本小说
- `DELETE http://localhost:4000/api/v1/gysw/shelf` 删除书架中的一本小说

#### 搜索相关接口

- `GET http://localhost:4000/api/v1/gysw/search/hot` 查询热门搜索列表
- `GET http://localhost:4000/api/v1/gysw/search/hist` 查询用户搜索历史
- `GET http://localhost:4000/api/v1/gysw/search/novel` 根据小说名/作者名查询小说列表

#### 小说相关接口

- `GET http://localhost:4000/api/v1/gysw/novel/content` 查询小说某一章节内容。章节标题，章节内容等
- `GET http://localhost:4000/api/v1/gysw/novel/chapter` 查询小说章节列表数据，展示所有章节
- `GET http://localhost:4000/api/v1/gysw/novel/detail`  查询小说详细内容。小说书名、作者名、简介等
- `GET http://localhost:4000/api/v1/gysw/novel/classify`  查询小说分类列表信息。修真、都市、灵异、军事等

更多接口详见 `src/router.js` 文件。

接口仅供参考，学习，请勿干坏事哦~

### 接口响应说明

```
// 接口响应格式：
{
  code: string;
  message: string;
  data: object|array;
}

只有 code === '0000' 说明请求成功；
当看到 code === '9999' 或其它非 '0000' 时，表示业务处理失败。比如：该用户已经注册，不能重复注册等。
```