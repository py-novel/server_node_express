import 'reflect-metadata'
import { createConnection } from 'typeorm'
import path from 'path'
import { dbHost, dbUser, dbPassword, dbDatabase } from '../config'

export default function getConnection() {
    return createConnection({
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
}