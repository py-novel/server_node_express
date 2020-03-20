import cheerio from 'cheerio'
import qs from 'querystring'

import BaseReptile from './Base.reptile'
import { getHtml, getRandomAlphaNum } from '../util'

import NovelSearch from '../entity/NovelSearch'
import NovelIntro from '../entity/NovelIntro'
import NovelChapter from '../entity/NovelChapter'
import NovelContent from '../entity/NovelContent'

export default class Biquge5200Reptile implements BaseReptile {
    async reptileNovelList(keyword: string): Promise<NovelSearch[]> {
        const searchUrl = 'https://www.biquge5200.cc/modules/article/search.php?searchkey=' + qs.escape(keyword)
        const html = await getHtml(searchUrl)

        const $ = cheerio.load(html)
        const $trs = $('tr').slice(1)
        const novels: NovelSearch[] = []

        for (let i = 0; i < $trs.length; i++) {
            const searchNovel = new NovelSearch()
            searchNovel.bookName = $($trs[i]).find('td').eq(0).find('a').text()
            searchNovel.authorName = $($trs[i]).find('td').eq(2).text()
            searchNovel.bookUrl = $($trs[i]).find('td').eq(0).find('a').attr('href') || ''
            novels.push(searchNovel)
        }

        return novels
    }

    async reptileNovelIntro(url: string): Promise<NovelIntro | null> {
        const html = await getHtml(url)
        const $ = cheerio.load(html)

        const novelIntro = new NovelIntro()
        novelIntro.bookName = $('div#info h1').text()                                             // 书名
        novelIntro.authorName = $('div#info p').eq(0).text().split('：')[1]                       // 作者
        novelIntro.classifyName = $('div.con_top a').eq(2).text()                                 // 小说类型
        novelIntro.lastUpdateAt = $('div#info p').eq(2).text().replace('最后更新：', '')            // 最后更新时间
        novelIntro.bookDesc = $('div#intro p').text()                                             // 小说简介
        novelIntro.recentChapterUrl = $($('dd a').slice(9)[0]).attr('href') || ''                 // 小说第一章地址

        if (!novelIntro.recentChapterUrl) {
            return null
        }

        return novelIntro
    }

    async reptileChapterList(url: string): Promise<NovelChapter[]> {
        const html = await getHtml(url)
        const $ = cheerio.load(html)

        const $dds = $('dd a').slice(9)

        if ($dds.length === 0) {
            throw new Error('小说网址错误，没查到小说章节')
        }

        const chapters: NovelChapter[] = []
        for (let i = 0; i < $dds.length; i++) {
            const chapter = new NovelChapter()
            chapter.name = $($dds[i]).text()
            chapter.url = $($dds[i]).attr('href') || ''
            chapter.uuid = getRandomAlphaNum()
            chapters.push(chapter)
        }

        return chapters
    }

    async reptileNovelContent(url: string): Promise<NovelContent | null> {
        const html = await getHtml(url)
        const $ = cheerio.load(html)

        const novelContent = new NovelContent()
        novelContent.title = $('div.bookname h1').text()                          // 章节标题
        novelContent.content = $('div#content').html() || ''                      // 章节内容
        novelContent.prevUrl = $('div.bottem1 a').eq(1).attr('href') || ''        // 上一章节 url
        novelContent.nextUrl = $('div.bottem1 a').eq(3).attr('href') || ''        // 下一章节 url

        if (!novelContent.title || !novelContent.content) {
            return null
        }

        return novelContent
    }

}