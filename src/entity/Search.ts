import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import User from './User'

@Entity()
export default class Search {
    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    id: string;

    @Column({ comment: '关键字' })
    keyword: string;

    @Column({ comment: '次数' })
    times: number;

    @Column('datetime', { comment: '最后更新时间' })
    lastUpdateAt: Date;

    @ManyToOne(type => User, user => user.searchs)
    @JoinColumn({ name: 'user_id' })
    user: User;
}