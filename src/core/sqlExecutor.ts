import initSqlJs, { Database, SqlJsStatic} from "sql.js";

let SQL: SqlJsStatic;

export const initDB = async (initSql?: string) => {
    if (!SQL) {
        SQL = await initSqlJs({
            locateFile: () => 
                "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm"
            
        })
    }
    const db = new SQL.Database();
    
    if (initSql) {
        db.run(initSql)
    }
    return db
}

export const runSQL = async (db: Database, sql: string) => {
    return db.exec(sql)
}