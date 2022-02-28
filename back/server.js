const dotenv = require('dotenv')
dotenv.config()
const http = require("http");
const app = require("./app");
const InstallSchema = require('./src/database/install-schema');
const crypto = require('crypto');
const MyCrypto = require("./src/tools/crypto");
const Users = require('./src/database/table/users');
const mysql = require('./src/database/mysql')
const { ADMIN_PWD } = process.env

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
const myCrypto = new MyCrypto();
server.listen(process.env.PORT || 3000, () => {
  new InstallSchema().processCreateDatabase().then(async (result) => {
    console.log('> Install schema is over')

    const users = new Users()
    //vérifier si un admin existe en DB, sinon, en créer un.
    const checkAdminAccount = await users.getByField({ users_isAdmin: 1 })
    if (!checkAdminAccount.length) {
      const md5Password = crypto.createHash('md5').update(ADMIN_PWD).digest('hex')
      const params = [
        'admin', 'admin', myCrypto.encrypt('admin@admin.fr'), md5Password, 1,
      ]
      mysql.execute(`
          INSERT INTO users (users_lastName, users_firstName, users_mail, users_pwd, users_isAdmin) 
          VALUES (?,?,?,?,?),(?,?,?,?,?)
      `, params)
    }

  }).catch(err => {
    console.log('> Install schema error', err)
  })
});