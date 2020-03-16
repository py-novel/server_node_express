
interface IUserVo {
    nickname?: string;
    avatarUrl?: string;
    username?: string;
    password?: string;
    gender?: string;
    address?: string;
    birth?: string;
    remark?: string;
    userId?: number;
}

export default {
    /**
     * 根据 username 查询用户信息
     */
    getUser: async function ({ username, password, userId }: { username?: string, password?: string, userId?: number }) {
        let sql = 'select id, username, nickname, avatar_url from gysw_user where 1 = 1'
        if (username) {
            sql += ` and username = "${username}"`
        }
        if (password) {
            sql += ` and password = "${password}"`
        }
        if (userId) {
            sql += ` and id = ${userId}`
        }
        const result = await global.dbexec(sql)
        result.data = result.data[0] || {}
        return result
    },

    /**
     * 新增一条用户信息
     */
    saveUser: async function ({ clientType, username, password }: { clientType: string, username: string, password: string }) {
        const sql = 'insert into gysw_user(username, password, client_type, create_at) values (?, ?, ?, now())'
        const result = await global.dbexec(sql, [username, password, clientType])
        return result
    },

    /**
     * 修改用户信息
     */
    updateUser: async function ({ nickname, avatarUrl, username, password, gender, address, birth, remark, userId }: IUserVo) {

        let sql = 'update gysw_user'
        if (username) {
            sql += ` set username = "${username}"`
        }
        if (userId) {
            sql += ` set id = ${userId}`
        }
        if (nickname) {
            sql += `, nickname = "${nickname}"`
        }
        if (avatarUrl) {
            sql += `, avatar_url = "${avatarUrl}"`
        }
        if (gender) {
            sql += `, gender = "${gender}"`
        }
        if (address) {
            sql += `, address = "${address}"`
        }
        if (birth) {
            sql += `, birth = "${birth}"`
        }
        if (remark) {
            sql += `, remark = "${remark}"`
        }
        if (password) {
            sql += `, password = "${password}"`
        }
        sql += ', last_update_at = now() where 1 = 1'
        if (username) {
            sql += ` and username = "${username}"`
        }
        if (userId) {
            sql += ` and id = ${userId}`
        }

        const result = await global.dbexec(sql)
        return result
    },
}