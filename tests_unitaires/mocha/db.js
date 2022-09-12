// Import modules
require("dotenv").config();
const assert = require('assert');
const { db } = require("../../server")

// const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, PORT_NODE } = process.env;


// // Config DB
// let configDB = {
//     host: DB_HOST,
//     user: DB_USER,
//     password: DB_PASSWORD,
//     database: DB_DATABASE,
//   };

// // Création de la connection avec les paramètres donner
// let db = mysql.createConnection(configDB);


describe('CRUD LOGIN', () => {

    let newComment = {}

    beforeEach(async () => {
        let com = await db.query(`INSERT INTO comments SET commentary="geste", id_user="2", image=""`)
        let comments = await db.query(`SELECT * FROM comments WHERE id_comments = "${com.insertId}"`)
        newComment = comments[0];
        console.log("OK pour le moment", newComment);
        assert.strictEqual('object', typeof newComment);

    })

    // A DECOMMENTER SI ON VEUT SUPPRIMER LE CONTENU DE LA DB
    /*
        afterEach(async () => {
            console.log("after each")
            await db.query(`DELETE FROM comments WHERE id_comments = ${newComment.id_comments}`)
            console.log("COMMENTAIRE DELETE")
        })*/


    it("Get ALL Commentaire", async () => {
        let data = await db.query(`Select * from comments`)
        assert.strictEqual(typeof data, typeof []);
    })

    it("Get ID Commentaire", async () => {
        let data = await db.query(`Select * from comments Where id_comments="${newComment.id_comments}"`)
        assert.strictEqual('object', typeof data);
    })


    it("Update Commentaire", async () => {
        let data = await db.query(`UPDATE comments SET commentary="Michelle" WHERE id_comments="${newComment.id_comments}"`)
        assert.strictEqual('object', typeof data)
    })

    it("Delete Commentaire", async () => {
        let data = await db.query(`DELETE FROM comments WHERE id_comments="${newComment.id_comments}"`)
        assert.strictEqual('object', typeof data)
    })
});