declare global {
    interface IResponse {
        code: '0000' | '9999',      // 响应状态码，'0000' 操作成功，'9999' 操作失败，如校验失败、参数少传多传
        message: string,            // 响应描述
        data: object,               // 响应体
    }
}

export { }