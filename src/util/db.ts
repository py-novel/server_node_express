import 'reflect-metadata'
import { createConnection, ConnectionOptions } from 'typeorm'
import debug from 'debug'
import path from 'path'
import { dbHost, dbProt, dbUser, dbPassword, dbDatabase } from '../config'

const log = debug('src/util/db')

export const dbConfig: ConnectionOptions = {
    type: 'mysql',
    host: dbHost,
    port: dbProt,
    username: dbUser,
    password: dbPassword,
    database: dbDatabase,
    extra: {
        charset: 'utf8mb4_unicode_ci'
    },
    entities: [
        path.join(__dirname, '../entity/**.js')
    ],
    synchronize: true,
    timezone: '+00:00',  // 时区
    logging: false,
}

export default function createConnectionPoor(cb: () => void) {
    createConnection(dbConfig)
        .then(cb)
        .catch(e => log(`TypeORM connection error: ${e.message}`))
}
