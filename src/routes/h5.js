const jwt = require('jsonwebtoken')
const userDao = require('../daos/user')
const { tokenSecret, tokenExpiresIn } = require('../../config')

module.exports = {
    /**
     * h5登录接口
     */
    signin: async function (req, res) {
        const { username } = req.body

        if (!username) {
            return res.json({ code: '9999', message: '用户名(username)不能为空', data: {} })
        }

        try {
            // 查询用户信息
            const userResult = await userDao.getUser({ username })
            const token = jwt.sign({ username }, tokenSecret, { expiresIn: tokenExpiresIn })
            // 用户不存在，则新增用户
            if (!userResult.data.id) {
                const insertResult = await userDao.saveUser({ clientType: 'H5', username, password: username })
                res.json({
                    code: '0000', 
                    message: '获取用户信息成功', 
                    data: { 
                        userId: insertResult.data.insertId,
                        token, 
                    }, 
                })
            } else {
                res.json({ 
                    code: '0000', 
                    message: '获取用户信息成功', 
                    data: { 
                        userId: userResult.data.id,
                        token,
                    }, 
                })
            }
        } catch (e) {
            console.log('[-] routes > h5 > signin()', e.message)
            res.json({ code: '9999', message: '获取用户信息失败', data: {} })
        }
    },
}