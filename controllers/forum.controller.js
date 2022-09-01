/*
    Forum Controlleur
*/



// Page Forum
exports.getPageForum = (req, res) => {
  db.query(`SELECT * FROM user INNER JOIN comments ON user.id = comments.id_user`,
    (err, data) => {
      if (err) return console.log(err)
      // console.log('data', data)
      res.render("forum", {
        db: data
      });
    })
}

// Envoi du commentaire
exports.sendComment = async (req, res) => {
  const { commentary, id_user } = req.body;
  const image = req.file ? req.file.filename : false;
  // console.log("image", req.file);

  if (image) await db.query(`INSERT INTO comments SET commentary="${commentary}", id_user="${req.session.user.id}" , image="${image}"`),
    console.log("image OK");
  else await db.query(`INSERT INTO comments SET commentary="${commentary}", id_user="${req.session.user.id}" , image=''`), 
  console.log("image NOK");

  console.log("envoi du controller OK");
  res.redirect("back");
}


// Modification du Commentaire
exports.editComment = async (req, res) => {
  const { id_comments } = req.params;
  const { newcommentary } = req.body;

  await db.query(
    `UPDATE comments SET commentary="${newcommentary}" WHERE id_comments=${id_comments};`,
    function (err, data) {
      if (err) throw err;

      // Redirection vers la page forum
      res.redirect("back"),
      {
        db: data,
      };
    }
  );
}

// Suppression du commentaire
exports.deleteComment = async (req, res) => {
  const { id_comments } = req.params;

  await db.query(
    `DELETE FROM comments WHERE id_comments=${id_comments}`,
    function (err, data) {
      if (err) throw err;

      res.redirect("/forum");
    }
  );
}