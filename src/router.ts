import { Application } from 'express'
import shelf from './route/shelf.route'
import search from './route/search.route'
import novel from './route/novel.route'
import classify from './route/classify.route'
import oauth from './route/oauth.route'

export default function (app: Application) {
    app.get('/test', (req, res) => res.send('hello world'))

    // 书架
    app.post('/shelf', shelf.createShelf)                               // 往书架中添加一本小说
    app.delete('/shelf/:id', shelf.removeShelf)                         // 在书架中删除一本小说
    app.get('/shelf', shelf.listShelves)                                // 查询书架列表

    // 搜索
    app.get('/search/hist', search.listHists)                           // 查询用户搜索历史
    app.get('/search/hot', search.listHots)                             // 查询热门搜索

    // 小说
    app.get('/novel/:id/detail', novel.findNovelContent)                // 查看小说内容
    app.get('/novel/:id/intro', novel.findNovelIntro)                   // 查看小说详情
    app.get('/novel/:id/chapters', novel.listNovelChapters)             // 查看小说章节
    app.get('/novels', novel.listNovels)                                // 查看小说列表

    // 小说分类
    app.get('/classifies', classify.listClassifies)                     // 查看小说分类 

    // 认证
    app.post('/oauth/login', oauth.login)                               // 登录
    app.post('/oauth/register', oauth.register)                         // 注册
    app.post('/oauth/resetPw', oauth.resetPw)                           // 重置密码
    app.post('/oauth/weapp/openid', oauth.findWeappOpenid)               // 获取微信小程序 openid 

}