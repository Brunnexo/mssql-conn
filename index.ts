import * as fs from 'fs';
import { Connection, Request } from 'tedious';

const ARGS: string[] = process.argv.slice(2);

interface SQLConfig {
    server: string,
    authentication: {
        type: string,
        options: {
            userName: string,
            password: string
        }
    },
    options: {
        encrypt: boolean,
        database: string,
        enableArithAbort: boolean,
        appName: string,
        useColumnNames: boolean
    }
}

interface SQLAttr {
    Connected: boolean,
    Connection?: Connection
}

class MSSQL {
    protected Config: SQLConfig

    protected Attr?: SQLAttr;
    private static SQL_VARIABLE: string;

    constructor(config: SQLConfig = {
        "server": "127.0.0.1",
        "authentication": {
            "type": "default",
            "options": {
                "userName": "sa",
                "password": "sa"
            }
        },
        "options": {
            "encrypt": false,
            "database": "db",
            "enableArithAbort": true,
            "appName": "default",
            "useColumnNames": true
        }
    }) {
        MSSQL.SQL_VARIABLE = '@VAR';
        this.Attr = { Connected: false };
        if (typeof(config) != 'object')
            throw new Error(`SQL 'Tedious' configuration not defined! (${typeof(config)})`);
        else this.Config = config;
    };

    static setVariable(variable: string) {
        if (typeof(variable) == 'string') MSSQL.SQL_VARIABLE = `@${variable}`;
        else throw new Error('The SQL Variable must be a String sequencer! Example "@VAR" for @VAR0, @VAR1...');
    };

    static QueryBuilder(sql: string, ...args: any[]) {
        let query = fs.readFileSync(`${__dirname}/SQL/${sql}.sql`, 'utf-8');
        let varCount = Number(query.split(MSSQL.SQL_VARIABLE).length - 1);
        if (varCount != args.length) {
            throw new Error(`The number of arguments does not match the SQL's necessary variables count!
            Number of arguments: ${args.length}
            Number of SQL variables: ${varCount}`);
        } else {
            if (varCount === 0) return query;
            else { 
                for (let i = 0; i < varCount; i++) query = query.replace(`${MSSQL.SQL_VARIABLE}${i}`, args[i]);
                return query;
            }
        }
    }
    
    async connect() {
        return new Promise((resolve, reject) => {
            if(this.Attr?.Connected === false) {
                this.Attr.Connection = new Connection(this.Config);
                this.Attr.Connection.on('connect', (err: any) => {
                    if (err) reject(err.message);
                    else {
                        this.Attr!.Connected! = true;
                        resolve(this.Attr!.Connected);
                    }
                });
            } else resolve(true);
        });
    }

    async select(query: string, row: Function) {
        await this.connect();
        return new Promise((resolve, reject) => {
            this.Attr!.Connection!.execSql(
                new Request(query, (err) => {
                    if (err) {reject(err.message)};
                })
                    .on('row', (data) => {row(data)})
                    .on('requestCompleted', () => {resolve(true)})
                    .on('error', (err) => {reject(err)})
            );
        });
    }

    async execute(query: string, row?: Function) {
        await this.connect();
        return new Promise<void>((resolve, reject) => {
            this.Attr!.Connection!.execSql(
                new Request(query, (err) => {
                    if (err) reject(err.message);
                })
                .on('row', (data) => {if ( typeof(row) === 'function') row(data) })
                .on('requestCompleted', () => { resolve() })
                .on('error', (err) => { reject(err.message) })
            )
        });
    }
}

function testConnection(props: any) {
    console.log(`\x1b[34m%s\x1b[0m`, `Testing SQL connection...\nServer: ${props.server}\nDatabase: ${props.database}\nUsername: ${props.userName}\nPassword: ${props.password}`);
    let test = new MSSQL({
        "server": props.server,
        "authentication": {
            "type": "default",
            "options": {
                "userName": props.userName,
                "password": props.password
            }
        },
        "options": {
            "encrypt": false,
            "database": props.database,
            "enableArithAbort": true,
            "appName": "default",
            "useColumnNames": true
        }
    });
    test.connect()
        .then(() => {
            console.log(`\x1b[32m%s\x1b[0m`, 'Connected successfully!');
            process.exit(1);
        })
        .catch((err) => {
            console.log(`\x1b[31m%s\x1b[0m`, `Connection fail!\n[${err}]`);
            process.exit(0);
        });
    return;
}

if (ARGS.length > 0) {
    let testArgs = {
        server: '',
        userName: '',
        password: '',
        database: ''
    };

    testArgs.server = ARGS.find(a => /--server=/g.test(a))?.replace('--server=', '').replace('"', '') || '127.0.0.1';
    testArgs.userName = ARGS.find(a => /--userName=/g.test(a))?.replace('--userName=', '').replace('"', '') || 'sa';
    testArgs.password = ARGS.find(a => /--password=/g.test(a))?.replace('--password=', '').replace('"', '') || 'sa';
    testArgs.database = ARGS.find(a => /--database=/g.test(a))?.replace('--database=', '').replace('"', '') || 'db';
    testConnection(testArgs);
}

export default MSSQL;
