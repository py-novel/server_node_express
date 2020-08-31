import debug from 'debug'
import { createConnection, Connection } from 'typeorm'
import { dbConfig } from '../util/db'

/**
 * 初始化操作：
 * - 自动创建/同步数据库表；
 * - 自动初始化表示例数据。
 */
class InitScript {
    constructor(conn: Connection) {
    }

    async start() {
        process.exit(0)
    }

    async clearAllData() {

    }

}


createConnection(dbConfig)
    .then(conn => {
        const script = new InitScript(conn)
        script.start()
    })