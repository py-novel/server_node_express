# 我为什么使用 Typeorm

|  | 使用前 | 使用后 |
| --- | --- | --- |
| 1. 建表 | 往数据库中导入根目录下的 novel.sql 脚本文件 | 建表语句写在代码里(src/entity/*) |
| 2. 修改表字段名称/类型 | 去数据库软件里手动修改 | 直接改代码，运行程序，数据库表自动同步(src/entity/*) |
| 3. 初始化数据 | 往数据库中导入根目录下的 novel.sql 脚本文件 | 初始化数据写在代码里，运行脚本 `$ npm run init` |
| 4. 多表关联操作 | 写sql语句，复杂 | 实体类自动映射关系，操作对象简单 |


# 初始化数据步骤

- 安装依赖
- 前往 mysql 数据库创建一个数据库，比如 database = 'novel'
- 编辑 [src/config.ts](./config.md)，添加数据库配置信息；
- 执行 npm 脚本 `$ npm run init`；
- 结束后查看数据库，表建好了，也初始化一部分数据。