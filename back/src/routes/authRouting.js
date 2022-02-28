const { BASE_API, BASE_AUTH, TOKEN_SECRET } = process.env;
const express = require("express");
const Users = require("../database/table/users");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const MyCrypto = require("../tools/crypto");

const myCrypto = new MyCrypto();
const baseUrl = `${BASE_API}${BASE_AUTH}`;

router.post(`${baseUrl}`, async (req, res) => {
  const { users_mail, users_pwd } = req.body;
  if (!users_mail || !users_pwd) {
    res.status(400).json("Une erreur est survenue lors de la requête");
    return;
  }

  const usersTable = new Users();
  const users = await usersTable.getByField({
    users_mail:  myCrypto.encrypt(users_mail)
  });

  if (!users.length) {
    res.status(401).json("Utilisateur non trouvée");
    return;
  }

  const user = users[0];
  const md5Password = crypto.createHash('md5').update(users_pwd).digest('hex')
  if (md5Password !== user.users_pwd) {
    res.status(403).json('Mot de passe incorrect')
    return
  }

  const token = jwt.sign(user, TOKEN_SECRET, { expiresIn: "24h" });
  res.json({
    token: token,
    status: 200,
    user: user,
  });

});

module.exports = router;
