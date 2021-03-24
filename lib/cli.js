"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const ARGS = process.argv.slice(2);
function testConnection(props) {
    console.log(`\x1b[34m%s\x1b[0m`, `Testing SQL connection...\nServer: ${props.server}\nDatabase: ${props.database}\nUsername: ${props.userName}\nPassword: ${props.password}`);
    let test = new index_1.default({
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
    testArgs.server = ((_a = ARGS.find(a => /--server=/g.test(a))) === null || _a === void 0 ? void 0 : _a.replace('--server=', '').replace('"', '').replace("'", '')) || '127.0.0.1';
    testArgs.userName = ((_b = ARGS.find(a => /--userName=/g.test(a))) === null || _b === void 0 ? void 0 : _b.replace('--userName=', '').replace('"', '').replace("'", '')) || 'sa';
    testArgs.password = ((_c = ARGS.find(a => /--password=/g.test(a))) === null || _c === void 0 ? void 0 : _c.replace('--password=', '').replace('"', '').replace("'", '')) || 'sa';
    testArgs.database = ((_d = ARGS.find(a => /--database=/g.test(a))) === null || _d === void 0 ? void 0 : _d.replace('--database=', '').replace('"', '').replace("'", '')) || 'db';
    testConnection(testArgs);
}
