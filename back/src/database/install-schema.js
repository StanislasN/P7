const mysql = require('./mysql')

class InstallSchema {
    constructor() { }
    async processCreateDatabase() {
        this.database = await mysql.createPool()
        return new Promise(async (resolve, reject) => {

            let requests = []

            requests.push(`
            CREATE TABLE IF NOT EXISTS users 
            (
                users_id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
                users_lastName VARCHAR(255) NOT NULL, 
                users_firstName VARCHAR(255) NOT NULL, 
                users_mail VARCHAR(255) NOT NULL UNIQUE,
                users_pwd VARCHAR(255) NOT NULL, 
                users_birthday DATE NULL,
                users_isAdmin TINYINT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 
            `)

            requests.push(`
            CREATE TABLE IF NOT EXISTS  posts 
            (
                posts_id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
                posts_author INT(11) NOT NULL,
                posts_title VARCHAR(255) NOT NULL, 
                posts_file VARCHAR(255) NULL, 
                posts_dateOfPublish DATETIME NOT NULL DEFAULT NOW(),
                posts_likes INT(5) NOT NULL DEFAULT 0,
                posts_unlikes INT(5) NOT NULL DEFAULT 0,
                posts_numberOfComments INT(5) NOT NULL DEFAULT 0,
            FOREIGN KEY (posts_author) REFERENCES users(users_id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
            `)

            requests.push(`
            CREATE TABLE IF NOT EXISTS comments
            (
                comments_id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
                comments_author INT(11) NOT NULL,
                comments_post INT(11) NOT NULL,
                comments_content TEXT(500) NOT NULL, 
                FOREIGN KEY (comments_author) REFERENCES users(users_id) ON DELETE CASCADE,
                FOREIGN KEY (comments_post) REFERENCES posts(posts_id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 
            `)

            let promises = []
            const connection = await this.database.getConnection()

            try {
                while (requests.length > 0) {
                    let query = requests.shift()
                    promises.push(
                        connection.query(query, (error, results, fields) => {
                            if (error) {
                                reject(error.sqlMessage)
                            }
                        })
                    )
                }
                let results = Promise.all(promises)
                results.then(async (values) => {
                    console.log('> Install schema complete')
                    if (connection) connection.release()
                    resolve(true)
                }).catch((e) => {
                    console.log(e)
                    reject(e.sqlMessage)
                })
                return
            } catch (e) {
                console.log(e)
                reject(e.sqlMessage)
            }
        })
    }
}
module.exports = InstallSchema