### 接口响应说明

```
// 接口响应格式：
{
  code: string;
  message: string;
  data: object|array;
}

只有 code === '0000' 说明请求成功；
当看到 code === '9999' 或其它非 '0000' 时，表示业务处理失败。比如：该用户已经注册，不能重复注册等。
```