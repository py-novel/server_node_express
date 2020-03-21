import redis from 'redis'
import { promisify } from 'util'
import debug from 'debug'

const log = debug('src/util/redis')
const client = redis.createClient()
client.on('connect', function () {
    log('redis connected....')
})

export const getAsync = promisify(client.get).bind(client)
export const setAsync = promisify(client.set).bind(client)

export default client