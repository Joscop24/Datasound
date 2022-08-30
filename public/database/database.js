const mysql = require('mysql')

// Création de la connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
  });


 module.exports = db;