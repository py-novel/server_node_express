import NovelSearch from '../entity/NovelSearch'
import NovelIntro from '../entity/NovelIntro'
import NovelChapter from '../entity/NovelChapter'
import NovelContent from '../entity/NovelContent'

export default class BaseReptile {

    /**
     * 根据搜索关键词爬取小说列表数据
     * @param keyword 搜索关键词
     */
    reptileNovelList(keyword: string): Promise<NovelSearch[]> {
        throw new Error("Method reptileNovelList() not implemented.")
    }

    /**
     * 根据小说主页爬取小说详情数据
     * 包括：书名、作者名、分类名称、最后更新时间、小说简介、小说封面图片地址、第一章地址
     * @param url 小说主页网址 https://www.biquge5200.cc/2_2041/
     */
    reptileNovelIntro(url: string): Promise<NovelIntro | null> {
        throw new Error("Method reptileNovelIntro() not implemented.")
    }

    /**
     * 根据小说主页地址爬取章节列表数据
     * @param url 小说主页网址 https://www.biquge5200.cc/2_2041/
     */
    reptileChapterList(url: string): Promise<NovelChapter[]> {
        throw new Error("Method reptileChapterList() not implemented.")
    }

    /**
     * 根据小说章节地址爬取章节内容
     * @param url 小说章节网址 https://www.biquge5200.cc/2_2041/1481505.html
     */
    reptileNovelContent(url: string): Promise<NovelContent | null> {
        throw new Error("Method reptileNovelContent() not implemented.")
    }

}