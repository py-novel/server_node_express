import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Audit {

    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    id: string;

    @Column({ comment: '请求方法' })
    method: string;

    @Column({ comment: '请求地址' })
    url: string;

    @Column('datetime', { comment: '请求时间' })
    datetime: Date;

    @Column('varchar', { comment: '请求参数 body', default: '{}' })
    body: string;

    @Column('varchar', { comment: '请求参数 query', default: '{}' })
    query: string;

    @Column('varchar', { comment: '请求参数 params', default: '{}' })
    params: string;
}