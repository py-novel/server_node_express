import url from 'url'
import NovelSearch from './entity/NovelSearch'
import BaseReptile from './source/Base.reptile'
import Biquge5200 from './source/Biquge5200.reptile'
import YixuanjuReptile from './source/Yixuanju.reptile'

export default class ReptileFactory {
    static domains: Record<string, any> = {
        'www.biquge5200.cc': new Biquge5200(),          // 笔趣阁
        'www.yixuanju.com': new YixuanjuReptile(),      // 奕轩居
        '': null,
    }

    static getReptile(targetUrl: string): BaseReptile {
        const host = url.parse(targetUrl).host || ''
        return this.domains[host]
    }

    static async getNovelsByKeyword(keyword: string): Promise<NovelSearch[]> {
        const domains = this.domains
        let novels: NovelSearch[] = []
        for (let domain of Object.keys(domains)) {
            if (!domains[domain]) continue
            novels = await (domains[domain] as BaseReptile).reptileNovelList(keyword)
            if (novels && Array.isArray(novels) && novels.length > 0) break
        }
        return novels
    }
}