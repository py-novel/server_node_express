import cheerio from 'cheerio'
import url from 'url'
import BaseReptile from './Base.reptile'
import { getHtml, getRandomAlphaNum } from '../util'

import NovelSearch from '../entity/NovelSearch'
import NovelIntro from '../entity/NovelIntro'
import NovelChapter from '../entity/NovelChapter'
import NovelContent from '../entity/NovelContent'

export default class YixuanjuReptile implements BaseReptile {
    async reptileNovelList(keyword: string): Promise<NovelSearch[]> {
        // const searchUrl = 'https://www.biquge5200.cc/modules/article/search.php?searchkey=' + keyword
        // const html = await getHtml(searchUrl)

        // const $ = cheerio.load(html)
        // const $trs = $('tr').slice(1)
        // const novels: NovelSearch[] = []

        // for (let i = 0; i < $trs.length; i++) {
        //     const searchNovel = new NovelSearch()
        //     searchNovel.bookName = $($trs[i]).find('td').eq(0).find('a').text()
        //     searchNovel.authorName = $($trs[i]).find('td').eq(2).text()
        //     searchNovel.bookUrl = $($trs[i]).find('td').eq(0).find('a').attr('href') || ''
        //     novels.push(searchNovel)
        // }

        // return novels

        // TODO 反扒机制
        return []
    }

    async reptileNovelIntro(targetUrl: string): Promise<NovelIntro | null> {
        const html = await getHtml(targetUrl, 'utf8')
        const $ = cheerio.load(html)

        const novelIntro = new NovelIntro()
        novelIntro.bookName = $('header.book-info-main h2.am-u-sm-8').text()                                // 书名
        novelIntro.authorName = $('header.book-info-main div.book-author').text().trim()                    // 作者
        novelIntro.classifyName = $($('ol.am-breadcrumb li').eq(1)).children('a').text()                    // 小说类型
        novelIntro.lastUpdateAt = $('div.book-info-main div.book-author').text().trim()                     // 最后更新时间
        novelIntro.bookDesc = $('div.book-info-text').text().replace(/\s/g, '')                             // 小说简介

        // 小说封面
        novelIntro.bookCover = this.formatUrl(targetUrl,
            $('div.am-thumbnail img').attr('src') || '')
        // 小说第一章地址
        novelIntro.recentChapterUrl = this.formatUrl(targetUrl,
            $($('ul.am-list-static li').eq(0)).children('a').attr('href') || '')

        if (!novelIntro.recentChapterUrl) {
            return null
        }

        return novelIntro
    }

    async reptileChapterList(targetUrl: string): Promise<NovelChapter[]> {
        const html = await getHtml(targetUrl, 'utf8')
        const $ = cheerio.load(html)
        const $lis = $('ul.am-list-static li')

        if ($lis.length === 0) {
            throw new Error('小说网址错误，没查到小说章节')
        }

        const chapters: NovelChapter[] = []
        for (let i = 0; i < $lis.length; i++) {
            const chapter = new NovelChapter()
            chapter.name = $($lis[i]).children('a').text()
            chapter.url = this.formatUrl(targetUrl, $($lis[i]).children('a').attr('href') || '')
            chapter.id = getRandomAlphaNum()
            chapters.push(chapter)
        }

        return chapters
    }

    // TODO content 字段不是服务端渲染，拿不到数据
    async reptileNovelContent(targetUrl: string): Promise<NovelContent | null> {
        const html = await getHtml(targetUrl, 'utf8')
        const $ = cheerio.load(html)

        const novelContent = new NovelContent()
        novelContent.title = $('header.am-banner h1').text()                      // 章节标题
        novelContent.content = $('article.cha-content').html() || ''              // 章节内容
        novelContent.prevUrl = this.formatUrl(targetUrl, $('div#chatool a').eq(1).attr('href') || '')        // 上一章节 url
        novelContent.nextUrl = this.formatUrl(targetUrl, $('div#chatool a').eq(2).attr('href') || '')        // 下一章节 url

        if (!novelContent.title || !novelContent.content) {
            return null
        }

        return novelContent
    }

    /**
     * 拼接网址
     * @param targetUrl https://www.yixuanju.com/book/14168
     * @param pathname /book/14168/1411009
     * @return https://www.yixuanju.com/book/14168/1411009
     */
    formatUrl(targetUrl: string, pathname: string): string {
        const urlObj = url.parse(targetUrl)     // 解析目标地址，获取协议、主机名等信息
        return url.format({ protocol: urlObj.protocol, host: urlObj.host, pathname }) || ''
    }

}