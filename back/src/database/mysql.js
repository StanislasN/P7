const mysql = require('mariadb')

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env


const createPool = async () => {
    const pool = await mysql.createPool({
        connectionLimit: 10,
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        debug: false
    })
 
    return pool
}

const createConnection = async () => {
    const connection = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
    })
    connection.connect()
    return connection
}

const execute = async (queryString, params = null) => {
    const connection = await createConnection()
    const result = await new Promise(async (res, rej) => {
        const rows = await connection.query(queryString, params)
        connection.end()
        res(rows)
    })
    return result
}

module.exports = { 
    createPool,
    createConnection,
    execute
}