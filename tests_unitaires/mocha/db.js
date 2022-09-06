// Import modules
require("dotenv").config();
const assert = require('assert');
const mysql = require('mysql');

const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, PORT_NODE } = process.env;


// Config DB
let configDB = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  };

// Création de la connection avec les paramètres donner
let db = mysql.createConnection(configDB);

// Config ASYNC
const util = require("util");

describe('CRUD LOGIN', function () {

    let comments = {}
    beforeEach((done) => {
        db.query(`INSERT INTO comments SET commentary="test", id_user="2", image=""`,

            function (err, data, fields) {
                if (err) throw err;

                // console.log("OK pour le moment", data);
                comments.id = data.insertId;
                assert.strictEqual('number', typeof data.insertId);
                done();
            })
    })

    it("Get Commentaire", () => {
        db.query(`Select * from comments Where id_comments="${comments.id}"`, (err, data) => {
            if (err) throw err;

            // console.log("info data", data );
            assert.strictEqual('object', typeof data);
        })
    })

    it("Update Commentaire", () => {
        db.query(`UPDATE comments SET commentary="Michelle" WHERE id_comments="${comments.id}"`, (err, data) => {
            if (err) throw err;

            assert.strictEqual('object' , typeof data)
        })
    })

    it("Delete User", () => {
        db.query(`DELETE FROM comments WHERE id_comments="${comments.id}"`, (err, data) => {
            if(err) throw err;

            console.log("COMMENTAIRE DELETE");
            assert.strictEqual('object', typeof data)
        })
    })
});