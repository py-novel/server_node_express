import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import User from './User.entity'

@Entity()
export default class Search {
    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    id: string;

    @Column({ comment: '关键字', nullable: false })
    keyword: string;

    @Column({ comment: '次数', default: 1 })
    times: number;

    @CreateDateColumn({ comment: '创建时间', name: 'create_time', select: false })
    createTime: Date;

    @UpdateDateColumn({ comment: '更新时间', name: 'update_time', select: false })
    updateTime: Date;

    @ManyToOne(() => User, user => user.searches)
    @JoinColumn({ name: 'user_id' })
    user: User;
}