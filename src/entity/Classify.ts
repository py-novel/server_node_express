import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import Novel from './Novel'

@Entity()
export default class Classify {

    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    id: string;

    @Column({ comment: '路径' })
    path: string;

    @Column({ comment: '描述' })
    desc: string;

    @OneToMany(type => Novel, novel => novel.classify)
    novels: Novel[];
}