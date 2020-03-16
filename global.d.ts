declare global {
    namespace NodeJS {
        interface Global {
            dbexec: (sql: string, params?: Record<string, any>) => Promise<any>;
            db: any;
            sendEmail: any;
            redis: any;
        }
    }

    interface ResData {
        code: string;
        message: string;
        data?: any[] | object | null | undefined;
    }
}

export { }