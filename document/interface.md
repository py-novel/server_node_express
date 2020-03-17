### 所有接口

假设👆的配置中 `apiPrefix=/api/v1`，端口 `serverPort=4000`，启动之后本机访问接口为：

#### 测试接口

- `GET http://localhost:4000/api/v1` 测试接口，返回 hello world 表示启动成功 

#### 书架相关接口

- `GET http://localhost:4000/api/v1/gysw/shelf` 查询书架中所有小说
- `POST http://localhost:4000/api/v1/gysw/shelf` 往书架中新增一本小说
- `DELETE http://localhost:4000/api/v1/gysw/shelf` 删除书架中的一本小说

#### 搜索相关接口

- `GET http://localhost:4000/api/v1/gysw/search/hot` 查询热门搜索列表
- `GET http://localhost:4000/api/v1/gysw/search/hist` 查询用户搜索历史
- `GET http://localhost:4000/api/v1/gysw/search/novel` 根据小说名/作者名查询小说列表

#### 小说相关接口

- `GET http://localhost:4000/api/v1/gysw/novel/content` 查询小说某一章节内容。章节标题，章节内容等
- `GET http://localhost:4000/api/v1/gysw/novel/chapter` 查询小说章节列表数据，展示所有章节
- `GET http://localhost:4000/api/v1/gysw/novel/detail`  查询小说详细内容。小说书名、作者名、简介等
- `GET http://localhost:4000/api/v1/gysw/novel/classify`  查询小说分类列表信息。修真、都市、灵异、军事等

更多接口详见 `src/router.js` 文件。

接口仅供参考，学习，请勿干坏事哦~