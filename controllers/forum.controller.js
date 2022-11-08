/*
    Forum Controlleur
*/

// Import Module
// const { MODE } = process.env
require("dotenv").config();
const path = require("path");
const fs = require("fs");

//PING POUR TEST UNITAIRE
exports.getPing = (req, res) => {
  const data = {
    name: "pong !",
  };
  console.log("Controller ping");
  if (process.env.MODE === "test") {
    res.json({ data });
  } else {
    res.render("home", { data });
  }
};

// Page Forum
exports.getPageForum = async (req, res) => {
  let data;

  data = await db.query(
    `SELECT * FROM user INNER JOIN comments ON user.id = comments.id_user`
  );
  // TEST UNITAIRE OU PRODUCTION
  if (process.env.MODE === "test") {
    res.json({ data });
  } else {
    res.render("forum", {
      db: data,
    });
  }
};

// Envoi du commentaire
exports.sendComment = async (req, res) => {
  // console.log('sendComment 2', req.body)
  const { commentary } = req.body;
  const image = req.file ? req.file.filename : false;
  let data;

  if (image)
    data = await db.query(
      `INSERT INTO comments SET commentary="${commentary}", id_user="${req.session.user.id}" , image="${image}"`
    );
  else
    data = await db.query(
      `INSERT INTO comments SET commentary="${commentary}", id_user="${req.session.user.id}" , image=''`
    );

  // TEST UNITAIRE OU VRAI CODE
  if (process.env.MODE === "test") {
    res.json({ data });
  } else {
    res.redirect("back");
  }
};

exports.getCommentId = async (req, res) => {
  const { id_comments } = req.params;
  let data;

  data = await db.query(
    `SELECT * FROM user INNER JOIN comments ON user.id = comments.id_user where id_comments=${id_comments}`
  );
  // TEST UNITAIRE OU VRAI CODE
  if (process.env.MODE === "test") {
    res.json({ data });
  }
};

// Modification du Commentaire
exports.editComment = async (req, res) => {
  const { id_comments } = req.params;
  const { newcommentary } = req.body;
  let data;
  data = await db.query(`UPDATE comments 
  SET commentary="${newcommentary}" 
  WHERE id_comments=${id_comments};`);
  // TEST UNITAIRE OU VRAI CODE
  if (process.env.MODE === "test") {
    res.json({ data });
  } else {
    res.redirect("back"), { db: data };
  }
};

// Suppression du commentaire
exports.deleteComment = async (req, res) => {
  const { id_comments } = req.params;

  const [img] = await db.query(
    `SELECT image FROM comments WHERE id_comments=${id_comments}`
  );
  if (img.image !== "") {
    if (img.image !== "default.png") {
      pathImg = path.resolve("public/images/" + img.image);
      fs.unlink(pathImg, (err) => {
        if (err) throw err;
      });
    }
  }
  const data = await db.query(
    `DELETE FROM comments WHERE id_comments=${id_comments}`
  );

  if (process.env.MODE === "test") {
    res.json({ data });
  } else {
    res.redirect("/forum");
  }
};
