#!/usr/bin/env node
import MSSQL from './index';
const ARGS: string[] = process.argv.slice(2);
function testConnection(props: { server: string; userName: string; password: string; database: string; }) {
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

    testArgs.server = ARGS.find(a => /--server=/g.test(a))?.replace('--server=', '').replace('"', '').replace("'", '') || '127.0.0.1';
    testArgs.userName = ARGS.find(a => /--userName=/g.test(a))?.replace('--userName=', '').replace('"', '').replace("'", '') || 'sa';
    testArgs.password = ARGS.find(a => /--password=/g.test(a))?.replace('--password=', '').replace('"', '').replace("'", '') || 'sa';
    testArgs.database = ARGS.find(a => /--database=/g.test(a))?.replace('--database=', '').replace('"', '').replace("'", '') || 'db';
    testConnection(testArgs);
}