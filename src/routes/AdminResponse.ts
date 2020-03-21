interface IResponse {
    code: '0000' | '9999',      // 响应状态码，'0000' 操作成功，'9999' 操作失败，如校验失败、参数少传多传
    message: string,            // 响应描述
    data: object,               // 响应体
}

export default class AdminResponse {
    static success(message: string): IResponse
    static success(data: object | null, message?: string): IResponse
    static success(arg1: any, arg2?: any): IResponse {
        if (typeof arg1 === 'string') {
            return {
                code: '0000',
                message: arg1,
                data: {},
            }
        } else {
            return {
                code: '0000',
                message: arg2 || '操作成功',
                data: arg1 || {},
            }
        }
    }

    static failure(message?: string): IResponse {
        return {
            code: '9999',
            message: message || '操作失败',
            data: {},
        }
    }
}