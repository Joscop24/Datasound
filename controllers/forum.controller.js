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