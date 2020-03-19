import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import Search from './Search.entity'
import Shelf from './Shelf.entity'

@Entity()
export default class User {
    constructor(id?: string) {
        if (id) this.id = id
    }

    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    id: string;

    @Column({ comment: '用户名' })
    username: string;

    @Column({ comment: '登录密码' })
    password: string;

    @Column({ name: 'client_type', comment: '客户端类型。OPENID/MOBILE/THIRDQQ/THIRDWX' })
    clientType: string;

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

    @Column({ name: 'create_at', comment: '创建时间', nullable: true })
    createAt: Date;

    @Column({ name: 'last_update_at', comment: '最后一次更新时间', nullable: true })
    lastUpdateAt: Date;

    @OneToMany(type => Search, search => search.user)
    searchs: Search[];

    @OneToMany(type => Shelf, shelf => shelf.user)
    shelfs: Shelf[];
}