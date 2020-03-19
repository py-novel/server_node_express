import debug from 'debug'
import { Connection, Repository } from 'typeorm'
import getConnection from './utils/db'

import Classify from './entity/Classify.entity'
import Shelf from './entity/Shelf.entity'
import Novel from './entity/Novel.entity'
import User from './entity/User.entity'
import Search from './entity/Search.entity'

const classifyLog = debug('classify')
const novelLog = debug('novel')
const shelfLog = debug('shelf')
const searchLog = debug('search')
const userLog = debug('user')

class InitScript {
    classifyRepository: Repository<Classify>;
    novelRepository: Repository<Novel>;
    shelfRepository: Repository<Shelf>;
    userRepository: Repository<User>;
    searchRepository: Repository<Search>;

    constructor(conn: Connection) {
        this.classifyRepository = conn.getRepository(Classify)
        this.novelRepository = conn.getRepository(Novel)
        this.shelfRepository = conn.getRepository(Shelf)
        this.userRepository = conn.getRepository(User)
        this.searchRepository = conn.getRepository(Search)
    }

    async start() {
        await this.clearAllData()
        await this.initClassify()
        await this.initNovel()
        await this.initUser()
        await this.initSearch()
        await this.initShelf()
        process.exit(0)
    }

    async clearAllData() {
        await this.novelRepository.delete({})
        await this.classifyRepository.delete({})
        await this.shelfRepository.delete({})
        await this.searchRepository.delete({})
        await this.userRepository.delete({})
    }

    async initClassify() {
        classifyLog('start init classify data.....')

        const c1 = new Classify()
        c1.path = 'xuanhuanxiaoshuo'
        c1.desc = '玄幻小说'

        const c2 = new Classify()
        c2.path = 'xiuzhenxiaoshuo'
        c2.desc = '修真小说'

        classifyLog('save data one by one')
        await this.classifyRepository.save(c1)
        await this.classifyRepository.save(c2)

        classifyLog('end init classify data.....')
    }

    async initNovel() {
        novelLog('start init novel data...')

        const result = await this.classifyRepository.find()

        const n1 = new Novel()
        n1.authorName = '天蚕土豆'
        n1.bookName = '大主宰'
        n1.bookUrl = 'https://www.biquge5200.cc/0_7/'
        n1.lastUpdateAt = new Date()
        n1.classify = result[0]

        const n2 = new Novel()
        n2.authorName = '我吃西红柿'
        n2.bookName = '雪鹰领主'
        n2.bookUrl = 'https://www.biquge5200.cc/2_2598/'
        n2.lastUpdateAt = new Date()
        n2.classify = result[1]

        novelLog('save data one by one')
        await this.novelRepository.save(n1)
        await this.novelRepository.save(n2)

        novelLog('end init novel data.....')
    }

    async initUser() {
        userLog('start init user data....')

        const u1 = new User()
        u1.username = 'admin'
        u1.password = '123456'
        u1.clientType = 'H5'

        const u2 = new User()
        u2.username = 'dkvirus'
        u2.password = '123456'
        u2.clientType = 'H5'

        userLog('save data one by one')
        await this.userRepository.save(u1)
        await this.userRepository.save(u2)

        userLog('end init user data....')
    }

    async initSearch() {
        searchLog('start init search data....')

        const result = await this.userRepository.find()

        const s1 = new Search()
        s1.keyword = '兵者'
        s1.times = 2
        s1.lastUpdateAt = new Date()
        s1.user = result[0]

        const s2 = new Search()
        s2.keyword = '七品'
        s2.times = 7
        s2.lastUpdateAt = new Date()
        s2.user = result[1]

        searchLog('save data one by one')
        await this.searchRepository.save(s1)
        await this.searchRepository.save(s2)

        searchLog('end init search data....')
    }

    async initShelf() {
        shelfLog('start init shelf data.....')

        const result = await this.userRepository.find()

        const s1 = new Shelf()
        s1.authorName = '天蚕土豆'
        s1.bookName = '大主宰'
        s1.recentChapterUrl = 'https://www.biquge5200.cc/0_7/2046.html'
        s1.lastUpdateAt = new Date()
        s1.user = result[0]

        const s2 = new Shelf()
        s2.authorName = '七品'
        s2.bookName = '兵者'
        s2.recentChapterUrl = 'https://www.biquge5200.cc/98_98081/155293499.html'
        s2.lastUpdateAt = new Date()
        s2.user = result[1]

        shelfLog('save shelf data one by one')
        await this.shelfRepository.save(s1)
        await this.shelfRepository.save(s2)

        shelfLog('end init shelf data.....')
    }
}

getConnection()
    .then(conn => {
        const script = new InitScript(conn)
        script.start()
    })