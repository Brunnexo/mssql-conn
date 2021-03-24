"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const tedious_1 = require("tedious");
class MSSQL {
    constructor(config = {
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
        if (typeof (config) != 'object')
            throw new Error(`SQL 'Tedious' configuration not defined! (${typeof (config)})`);
        else
            this.Config = config;
    }
    ;
    static setVariable(variable) {
        if (typeof (variable) == 'string')
            MSSQL.SQL_VARIABLE = `@${variable}`;
        else
            throw new Error('The SQL Variable must be a String sequencer! Example "@VAR" for @VAR0, @VAR1...');
    }
    ;
    static QueryBuilder(sql, ...args) {
        let query = fs.readFileSync(`${__dirname}/SQL/${sql}.sql`, 'utf-8');
        let varCount = Number(query.split(MSSQL.SQL_VARIABLE).length - 1);
        if (varCount != args.length) {
            throw new Error(`The number of arguments does not match the SQL's necessary variables count!
            Number of arguments: ${args.length}
            Number of SQL variables: ${varCount}`);
        }
        else {
            if (varCount === 0)
                return query;
            else {
                for (let i = 0; i < varCount; i++)
                    query = query.replace(`${MSSQL.SQL_VARIABLE}${i}`, args[i]);
                return query;
            }
        }
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a;
                if (((_a = this.Attr) === null || _a === void 0 ? void 0 : _a.Connected) === false) {
                    this.Attr.Connection = new tedious_1.Connection(this.Config);
                    this.Attr.Connection.on('connect', (err) => {
                        if (err)
                            reject(err.message);
                        else {
                            this.Attr.Connected = true;
                            resolve(this.Attr.Connected);
                        }
                    });
                }
                else
                    resolve(true);
            });
        });
    }
    select(query, row) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            return new Promise((resolve, reject) => {
                this.Attr.Connection.execSql(new tedious_1.Request(query, (err) => {
                    if (err) {
                        reject(err.message);
                    }
                    ;
                })
                    .on('row', (data) => { row(data); })
                    .on('requestCompleted', () => { resolve(true); })
                    .on('error', (err) => { reject(err); }));
            });
        });
    }
    execute(query, row) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            return new Promise((resolve, reject) => {
                this.Attr.Connection.execSql(new tedious_1.Request(query, (err) => {
                    if (err)
                        reject(err.message);
                })
                    .on('row', (data) => { if (typeof (row) === 'function')
                    row(data); })
                    .on('requestCompleted', () => { resolve(); })
                    .on('error', (err) => { reject(err.message); }));
            });
        });
    }
}
exports.default = MSSQL;
