import { Connection } from 'tedious';
interface SQLConfig {
    server: string;
    authentication: {
        type: string;
        options: {
            userName: string;
            password: string;
        };
    };
    options: {
        encrypt: boolean;
        database: string;
        enableArithAbort: boolean;
        appName: string;
        useColumnNames: boolean;
    };
}
interface SQLAttr {
    Connected: boolean;
    Connection?: Connection;
}
declare class MSSQL {
    protected Config: SQLConfig;
    protected Attr?: SQLAttr;
    private static SQL_VARIABLE;
    constructor(config?: SQLConfig);
    static setVariable(variable: string): void;
    static QueryBuilder(sql: string, ...args: any[]): string;
    connect(): Promise<unknown>;
    select(query: string, row: Function): Promise<unknown>;
    execute(query: string, row?: Function): Promise<void>;
}
export default MSSQL;
//# sourceMappingURL=index.d.ts.map