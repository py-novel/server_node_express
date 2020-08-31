import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import Novel from './Novel.entity'

@Entity()
export default class Classify {
    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    id: string;

    @Column({ comment: '路径', nullable: false })
    path: string;

    @Column({ comment: '描述', nullable: false })
    desc: string;

    @CreateDateColumn({ comment: '创建时间', name: 'create_time', select: false })
    createTime: Date;

    @UpdateDateColumn({ comment: '更新时间', name: 'update_time', select: false })
    updateTime: Date;

    @OneToMany(() => Novel, novel => novel.classify)
    novels: Novel[];
}