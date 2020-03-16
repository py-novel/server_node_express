interface IShelfVo {
    userId: number;
    authorName: string;
    bookName: string;
    bookDesc: string;
    bookCoverUrl: string;
    recentChapterUrl: string;
}

export default {

    /**
     * 新增一条书架信息
     */
    saveShelf: async function ({ userId, authorName, bookName,
        bookDesc, bookCoverUrl, recentChapterUrl }: IShelfVo) {
        const sql = `insert into gysw_shelf (user_id, author_name, book_name, 
            book_desc, book_cover_url, recent_chapter_url) values (?, ?, ?, ?, ?, ?)`

        const result = await global.dbexec(sql, [userId, authorName, bookName, bookDesc, bookCoverUrl, recentChapterUrl])
        return result
    },

    /**
     * 删除一条书架信息
     */
    deleteShelf: async function ({ id }: { id: number }) {
        const sql = 'delete from gysw_shelf where id = ?'
        const result = await global.dbexec(sql, [id])
        return result
    },

    /**
     * 修改书架信息
     */
    updateShelf: async function ({ id, recentChapterUrl }: { id: string, recentChapterUrl: string }) {
        const sql = 'update gysw_shelf set recent_chapter_url = ?, last_update_at = now() where id = ?'
        const result = await global.dbexec(sql, [recentChapterUrl, id])
        return result
    },

    /**
     * 查询书架列表信息
     */
    getShelfList: async function ({ userId, authorName, bookName }: { userId: number, authorName?: string, bookName?: string }) {
        let sql = 'select * from gysw_shelf where 1 = 1'

        if (userId) {
            sql += ` and user_id = ${userId}`
        }
        if (bookName) {
            sql += ` and book_name = "${bookName}"`
        }
        if (authorName) {
            sql += ` and author_name = "${authorName}"`
        }

        const result = await global.dbexec(sql)
        return result
    },
}