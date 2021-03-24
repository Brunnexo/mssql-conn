# MSSQL Connection Helper

![GitHub all releases](https://img.shields.io/github/downloads/brunnexo/mssql-conn/total?style=plastic)

Módulo Node.js para facilitar a comunicação com o Microsoft SQL Server

## Instalação

Necessário [Node.js](https://nodejs.org/en/) para instalar e [Microsoft SQL Server](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads) para executar

```
npm install mssql-conn
```

## Exemplo de uso

```javascript
const MSSQL = require('mssql-conn')

let test = new MSSQL({
    "server": "127.0.0.1", //Ou localhost ou o IP do servidor
    "authentication": {
        "type": "default",
        "options": {
            "userName": "sa", //Usuário para logon
            "password": "sa" //Senha - não é seguro expor a senha como texto, use criptografia!
        }
    },
    "options": {
        "encrypt": false,
        "database": "db", //Nome do banco de dados
        "enableArithAbort": true,
        "appName": "default", //Nome da aplicação que vai conectar ao banco (SQL Server Profiler)
        "useColumnNames": true //O retorno das tabelas serão <objeto>.<nome da coluna>.value
    }
});

//Conecta ao banco de dados
//Este comando serve para fins de teste, ao usar select ou execute

test.connect()
    .then(e => {
        //Conectado, uhull!
    })
    .catch(err => {
        //Deu erro
        console.log(err); //Mensagem de erro
    });

//Seleciona valores
let results = [];

test.select('SELECT * FROM TABELA', row => {  //Para cada linha encontrada, realizará um callback
    results.push(row);
}).then(() => {
    //Terminou o processo
}).cacth(err => {
    //Deu erro
    console.log(err); //Mensagem de erro
});

//Executa outros comandos, ou insere valores
test.execute("INSERT INTO TABELA ([Coluna 1], [Coluna 2]) VALUES ('OLÁ', 'MUNDO!')")
.then(() => {
    //Deu certo!
}).catch(err => {
    //Deu erro
    console.log(err);
});

```
## QueryBuilder
O QueryBuilder é um auxiliar que simplifica as execuções de comandos SQL, permitindo usar arquivos .SQL ao invés de longos textos.

O QueryBuilder vai buscar arquivos SQL no caminho:
```javascript
__dirname/SQL/<arquivo>.sql
```
### Exemplo
```javascript
//test = new MSSQL({...});

//Sem QueryBuilder
test.select('SELECT * FROM TABELA_FINANCEIRA WHERE [COLUNA] = 100');

//Com QueryBuilder
//QueryBuilder('<arquivo>', ...arg);
test.select(MSSQL.QueryBuilder('Financeira', '100')) //
```

Dentro do arquivo **Financeira.sql**, você encontraria isso:
```sql
SELECT * FROM TABELA_FINANCEIRA WHERE [COLUNA] = @VAR0
```
As variáveis seguem o padrão **@VAR** + o índice do argumento, iniciando em 0.

É possível alterar o nome da variável com o comando:
```javascript
test.setVariable('FOO');
```
Agora, o QueryBuilder vai buscar nos arquivos variáveis com o padrão **@FOO** + o índice do argumento.


## CLI
Use a linha de comando apenas para testar a conexão do ambiente Node com o Microsoft SQL Server:
```
mssqlt --userName="<usuário>" --password="<senha>" --database="<banco de dados>" --server="<IP ou local do servidor>"
```


## Contribuições
Toda ajuda é bem-vinda!

## Licença
[MIT](https://choosealicense.com/licenses/mit/)
