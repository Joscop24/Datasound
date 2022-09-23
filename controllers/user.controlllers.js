/*
    User Controlleur
*/

const bcrypt = require("bcrypt");
const bcrypt_salt = 10;

// Affichage Page Profil
exports.getPageProfil = (req, res) => {
  console.log("c'est moi ", req.query.q);
  switch (req.query.q) {
    case '4w':
      return res.render("profil");
      break;
    case '6m':
      return res.render("profil");
      break;
    case 'all':
      return res.render("profil");
      break;
    default:
      return res.render("profil");
      break
  }

}

// Page Edit-Profil
exports.getEditProfil = (req, res) => {
  db.query(`SELECT * FROM user`, function (err, data) {
    if (err) throw err;

    res.render("edit-profil", {
      db: data
    });
  });
}


// Update Edit-profil
exports.putUpdateProfil = (req, res) => {
  const { id } = req.params;
  const { newusername, email, newpassword, confirmpassword } = req.body;

  if (newpassword === confirmpassword) {
    bcrypt.hash(newpassword, bcrypt_salt, async (err, newhash) => {

      if (newusername) await db.query(`UPDATE user SET username="${newusername}" WHERE id=${id}`)
      if (email) await db.query(`UPDATE user SET email="${email}" WHERE id=${id}`)
      if (newpassword) await db.query(`UPDATE user SET password="${newhash}" WHERE id=${id}`)

      console.log(req.session);
      db.query(`SELECT * FROM user WHERE id=${req.session.user.id};`, (err, data) => {
        console.log("VLAAAAAAAAAAAAAAAAAA", data)
        req.session.user = {
          ...data[0]
        };
        res.redirect("/edit-profil");
      })

    });
  } else {
    res.render("edit-profil", { flash3: "Votre mot de passe de confirmation n'est pas conforme" })
  }
}