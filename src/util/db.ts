import 'reflect-metadata'
import { createConnection } from 'typeorm'
import debug from 'debug'
import path from 'path'
import { dbHost, dbUser, dbPassword, dbDatabase } from '../config'

const log = debug('src/util/db')

export default function createConnectionPoor(cb: () => void) {
    createConnection({
        type: 'mysql',
        host: dbHost,
        port: 3306,
        username: dbUser,
        password: dbPassword,
        database: dbDatabase,
        entities: [
            path.join(__dirname, '../entity/**.js')
        ],
        synchronize: true,
        logging: false
    })
        .then(cb)
        .catch(e => log(`TypeORM connection error: ${e.message}`))
}
