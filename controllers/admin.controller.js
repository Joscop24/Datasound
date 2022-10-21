/*
    Admin Controlleur
*/



// Affichage Page Admin
exports.getPageAdmin = async (req, res) => {
  await db.query(`SELECT * FROM user`, function (err, data) {
    if (err) throw err;

    res.render("admin", {
      db: data,
    });
  })
}

exports.postDataUser = async (req, res) => {
  const { username, name, email } = req.body;

  await db.query(
    `INSERT INTO user (username, name , email) VALUES ("${username}", "${name}", "${email}")`,
    (err, data) => {
      if (err) throw err;

    }
  );
  let body = req.body;
  res.redirect("back");
}


// Ban de l'utilisateur
exports.banUser = async (req, res) => {
  const { id } = req.params;

  // Supression de l'article par rapport a son id
  // await db.query(`DELETE FROM user WHERE id=${id}`, function (err, data) {
    await db.query(`UPDATE user SET isBan="1" WHERE id=${id}`, function (err, data) {
    if (err) throw err;

    // Redirection vers la page admin
    res.redirect("/admin");
  });
}