import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import Search from './Search.entity'
import Shelf from './Shelf.entity'

@Entity()
export default class User {
    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    id: string;

    @Column({ comment: '用户名', nullable: false })
    username: string;

    @Column({ comment: '登录密码', nullable: false, select: false })
    password: string;

    @Column({ comment: '昵称', nullable: true })
    nickname: string;

    @Column({ name: 'avatar_url', comment: '头像', nullable: true })
    avatarUrl: string;

    @Column({ comment: '生日', nullable: true })
    birth: string;

    @Column({ comment: '性别，男、女、保密', nullable: true })
    gender: string;

    @Column({ comment: '居住地址', nullable: true })
    address: string;

    @Column({ comment: '邮箱', nullable: true })
    email: string;

    @Column({ comment: '备注', nullable: true })
    remark: string;

    @CreateDateColumn({ comment: '创建时间', name: 'create_time', select: false })
    createTime: Date;

    @UpdateDateColumn({ comment: '更新时间', name: 'update_time', select: false })
    updateTime: Date;

    @OneToMany(() => Search, search => search.user)
    searches: Search[];

    @OneToMany(() => Shelf, shelf => shelf.user)
    shelves: Shelf[];
}