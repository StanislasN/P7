const Model = require("./model");
const Comments = require("./comments");
const mysql = require("../mysql");
const fs = require('fs')
const path = require('path')
const { BASE_POSTS } = process.env;

//initialiser la table "posts", puis chaque colones 
const tableName = "posts";
const primaryKey = `${tableName}_id`;
const foreignKey = [];
const fields = [
  `${tableName}_author`,
  `${tableName}_title`,
  `${tableName}_file`,
  `${tableName}_dateOfPublish`
];

class Posts extends Model {
  constructor() {
    super(tableName, primaryKey, foreignKey, fields);
    //appeler la fonction pour aller chercher ts les Posts & Comments et y associer leurs auteurs pour les renvoyer au FRONT
    this.getAll = async () => {
      const comments = new Comments()
      const commentsList = await comments.getAll()

      const sql = `SELECT * FROM ${this.tableName} INNER JOIN users ON posts_author = users_id`;
      const [...rows] = await mysql.execute(sql);

      const baseUrl = `${BASE_POSTS}`;
      //ajoute une colonne contenant l'URL de l'image du POST
      rows.forEach(e => {
        e.comments = commentsList.filter(c => c.comments_post === e.posts_id)
        e.posts_file = `${baseUrl}/public/image/${e.posts_file}`
      })
      return rows
    };

    //fonction de suppression l'IMG sur le serveur
    this.superDelete = this.delete
    this.delete = async (id) => {
      const post = await this.getById(id)
      const checkDelete = await this.superDelete(id)
      if(post.length && checkDelete) {
        const filePath = path.join(__dirname, `../../../assets/img/${post[0].posts_file}`)
        fs.unlink(filePath, () => {})
      }
      return checkDelete
    }
  }

}

module.exports = Posts;
