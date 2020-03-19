import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import User from './User.entity';

@Entity()
export default class Shelf {

    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    id: string;

    @Column({ name: 'author_name', comment: '作者名' })
    authorName: string;

    @Column({ name: 'book_name', comment: '书名' })
    bookName: string;

    @Column({ name: 'book_desc', comment: '小说描述', nullable: true })
    bookDesc: string;

    @Column({ name: 'book_cover_url', comment: '封面地址', default: 'https://novel.dkvirus.top/images/cover.png' })
    bookCoverUrl: string;

    @Column({ name: 'recent_chapter_url', comment: '最近阅读章节地址' })
    recentChapterUrl: string;

    @Column('datetime', { name: 'last_update_at', comment: '章节最后更新时间' })
    lastUpdateAt: Date;

    @ManyToOne(type => User, user => user.shelfs)
    user: User;
}