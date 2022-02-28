const mysql = require("../mysql");

//Module de gestion des requêtes SQL
class Model {
  constructor(tableName, primaryKey, foreignKey, fields) {
    this.tableName = tableName;
    this.foreignKey = foreignKey;
    this.primaryKey = primaryKey;
    this.fields = fields;
    this.data = {};

    //générateur de requêtes SQL pour GET sur une table au choix
    this.getAll = async () => {
      const sql = `SELECT * FROM ${this.tableName}`;
      const [...rows] = await mysql.execute(sql);
      return rows;
    };

    this.create = async () => {
      //si primaryKey existe ds le tableau de données (this.data), je la supprime (éviter conflit au refresh)
      delete this.data[this.primaryKey];
      const keys = Object.keys(this.data);
      const values = Object.values(this.data);

      //générateur de requêtes SQL pour POST sur une table au choix
      const valuesLength = "?,".repeat(keys.length).slice(0, -1);
      const sql = `INSERT INTO ${this.tableName} (${keys.join(
        ","
      )}) VALUES (${valuesLength})`;

      //vérifier si l'email de l'utilisateur créé existe déjà 
      let checkUniqueMail = await this.isUniqueMail(values[3]);
      if (checkUniqueMail) {
        const { insertId } = await mysql.execute(sql, values);
        return await this.getById(insertId);
      }else{
        return null;
      }  
    };
  }
  
  //requête SQL pour vérifier qu'un email n'existe pas ds la DB
  isUniqueMail = async (email) => {
    let sql = `SELECT users_mail FROM users WHERE users_mail = '${email}' `;
    const values = [];
    
    const [...rows] = await mysql.execute(sql, values);
    if (rows.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  //set les données ds les variables de la classe model
  set = (data) => {
    if (!data) return;
    for (let [key, value] of Object.entries(data)) {
      if (this.fields.includes(key)) this.data[key] = value;
    }
  };

  //Générateur de requêtes SQL GET filtrer par l'ID sur une table au choix
  getById = async (id) => {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`; 
    const [...rows] = await mysql.execute(sql, [id]);
    return rows;
  };

  //Générateur de requêtes SQL GET pour filtrer par FIELD sur une table au choix
  getByField = async (fields) => {
    let sql = `SELECT * FROM ${this.tableName} WHERE 1=1 `;
    const values = [];
    for (let [key, value] of Object.entries(fields)) {
      sql += `AND ${key} = ? `;
      values.push(value);
    }
    const [...rows] = await mysql.execute(sql, values);
    return rows;
  };

  //générateur de requêtes SQL pour PUT sur une table au choix
  modify = async (dataToUpdate) => {
    const id = dataToUpdate[this.primaryKey];
    this.set(dataToUpdate);
    delete this.data[this.primaryKey];

    const values = []
    let updateStr = ''
    for (let [key, value] of Object.entries(this.data)) {
      updateStr += `${key} = ?,`;
      values.push(value);
    }

    const sql = `UPDATE ${this.tableName} SET ${updateStr.slice(0, -1)} WHERE ${this.primaryKey} = ?`;
    await mysql.execute(sql, [...values, id]);
    return await this.getById(id);
  };

  //générateur de requêtes DELETE sur une table au choix filtrer par ID
  delete = async (id) => {
      const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
      const result = await mysql.execute(sql, [id]);
      return result.affectedRows
  };
}

module.exports = Model;
