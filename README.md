# SERVER_NODE_EXPRESS

Node + Express + Mariadb 提供后台接口服务。

**Clone Project**

``` bash
$ git clone git@github.com:py-novel/server_node_express.git
$ cd server_node_express
```

**Install**

``` bash
$ yarn
```

**Init Data**

建表 + 初始化表数据。（需要修改 [src/config.ts](./document/config.md) 文件添加数据库相关信息）

``` bash
$ npm run init
```

**Dev**

``` bash
$ npm run ts:watch
```

另打开一个终端：

``` bash
$ npm run dev
```

访问 `localhost:4000/api/v3`。

**TODO**

- [x] 升级到 typescript 版本；
- [x] 编写 ts 对应文档；
- [x] 集成 typeorm 重写，一键完成建表 + 初始化表数据；([我为什么集成 typeorm](./document/why-do-i-use-typeorm.md))
- [ ] 集成 [apacejs](https://github.com/apacejs/apace-cli)； 


