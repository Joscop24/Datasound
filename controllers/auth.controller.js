// Controlleur pour la connexion et l'inscription
/*
    Auth Controlleur
*/

const bcrypt = require("bcrypt");
const bcrypt_salt = 10;
const expressSession = require("express-session");
const MySQLStore = require("express-mysql-session")(expressSession);
const { setSession } = require("../utils/setSession");


exports.getPageAuth = (req, res) => {
    res.render("connexion");
}

// Connexion du user
exports.getConnexionUser = (req, res) => {
    const { email$, password$ } = req.body;
  db.query(
    `SELECT password from user WHERE email="${email$}"`,
    function (err, data) {
      if (err) throw err;

      if (!data[0])
        return res.render("home", { flash: "Ce compte n'existe pas" });
      bcrypt.compare(password$, data[0].password, function (err, result) {
        if (result === true) {
          setSession(req, res, email$);
        } else return res.render("connexion", { flash: "L'email ou le mot de passe n'est pas correct !" });
      });
    }
  );
}


// Inscription du User
exports.getInscriptionUser = (req, res) => {
    const { name, surname, username, email, password, confirmpassword } = req.body;

  if (password === confirmpassword) {
    bcrypt.hash(password, bcrypt_salt, function (err, hash) {
      db.query(`INSERT INTO user SET name="${name}", surname="${surname}", username="${username}", email="${email}" , password="${hash}", isAdmin="0", isBan="0"`),
        function (err, data) {
          if (err) throw err;
        };
    });
    res.redirect('/');
  } else {
    res.render("connexion", { flash2: "Votre mot de passe de confirmation n'est pas conforme" })
  }
}

// Affichage de la page Link
exports.getPageLink = (req, res) => {
    res.render("link")
}