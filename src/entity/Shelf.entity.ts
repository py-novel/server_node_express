import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import User from './User.entity';

@Entity()
export default class Shelf {

    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    id: string;

    @Column({ name: 'book_name', comment: '书名', nullable: false })
    bookName: string;

    @Column({ name: 'author_name', comment: '作者名', nullable: false })
    authorName: string;

    @Column({ name: 'recent_chapter_url', comment: '最近阅读章节地址', nullable: false })
    recentChapterUrl: string;

    @CreateDateColumn({ comment: '创建时间', name: 'create_time', select: false })
    createTime: Date;

    @UpdateDateColumn({ comment: '更新时间', name: 'update_time', select: false })
    updateTime: Date;

    @ManyToOne(() => User, user => user.shelves)
    user: User;

}