
export default class NovelIntro {
    /**
     * 书名
     */
    bookName: string;

    /**
     * 作者名
     */
    authorName: string;

    /**
     * 最后更新时间
     */
    lastUpdateAt: string;

    /**
     * 小说简介
     */
    bookDesc: string;

    /**
     * 小说封面地址
     */
    bookCover: string = 'https://novel.dkvirus.top/images/cover.png';

    /**
     * 小说主页地址
     */
    bookUrl: string;

    /**
     * 小说第一章节地址
     */
    recentChapterUrl: string;

    /**
     * 小说分类名称
     */
    classifyName: string;
}