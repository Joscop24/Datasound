// Controlleur pour la connexion et l'inscription
/*
    Auth Controlleur
*/
require('dotenv').config()
const bcrypt = require("bcrypt");
const bcrypt_salt = 10;
const expressSession = require("express-session");
const MySQLStore = require("express-mysql-session")(expressSession);
// const { setSession } = require("../utils/setSession");
const { MODE } = process.env
const { transporter } = require("../config/nodemailer");
const jwt = require("jsonwebtoken")


exports.getPageAuth = (req, res) => {
  res.render("connexion");
}

// Connexion du user
exports.getConnexionUser = (req, res) => {
  console.log('connexionUser')
  const { email, password } = req.body;

  db.query(
    `SELECT password, email from user WHERE email="${email}"`,
    function (err, data) {
      if (err) throw err;

      if (!data[0])
        if (MODE === 'test')
          return res.json({ flash: "Ce compte n'existe pas" });
        else
          return res.render("home", { flash: "Ce compte n'existe pas" });

      bcrypt.compare(password, data[0].password, async function (err, result) {
        if (err) {
          if (MODE === 'test') {
            return res.json({ flash: "Une erreur est survenu !" })
          } else {
            return res.render("connexion", { flash: "Une erreur est survenu !" })
          }
        } else if (result) {
          let [user] = await db.query(`SELECT * FROM user WHERE email = "${data[0].email}";`)
          req.session.user = { ...user }

          if (MODE === 'test')
            return res.json({ flash: "Vous êtes connecter !" })
          else
            return res.render("link")

        } else return res.render("connexion", { flash: "L'email ou le mot de passe n'est pas correct !" });
      });
    }
  );
}

/*
exports.lostPassword = async (req, res) => {
  const { resetmail } = req.body
  const user = await db.query(`SELECT id, email from user WHERE email="${resetmail}"`)

  var host = req.get('host')
  console.log('host', host)

  var linkmail = ""
}
*/


// Inscription du User
exports.getInscriptionUser = async (req, res) => {
  const { name, surname, username, email, password, confirmpassword } = req.body;

  if (password === confirmpassword) {
    // bcrypt.hash(password, bcrypt_salt, function (err, hash) {
    //   db.query(`INSERT INTO user SET name="${name}", surname="${surname}", username="${username}", email="${email}" , password="${hash}", isAdmin="0", isBan="0", isVerified="0";`)
    // });
    // req.session.user.id = 

    const newUser = await db.query(`INSERT INTO user SET name="${name}", surname="${surname}", username="${username}", email="${email}" , password="${await bcrypt.hash(password, bcrypt_salt)}", isAdmin="0", isBan="0", isVerified="0";`)
    const [user] = await db.query(`SELECT * FROM user WHERE id = ${newUser.insertId}`)

    const token = jwt.sign({ user }, "SecretKey");

    // req.session.user = user
    req.session.token = token

    // GESTION ENVOI POUR CONFIRMER LE MAIL

    try {

      const data = transporter.sendMail({
        from: '"Datasound" <jorisbourdin.pro@gmail.com>',
        to: email,
        subject: `Confirmation du compte Datasound`,
        html: `
                    <h2> Bonjour, </h2>
                    <h5>Pour activer votre compte utilisateur, veuillez cliquer sur le lien ci-dessous </h5><br>
                    http://localhost:3000/verification/${token}
                `
      })

      console.log("Email de confirmation de compte est bien envoyé !!", data)
      console.log("1er token", token);
      res.redirect('/');
    } catch (error) {
      console.log("error", error)
      res.redirect('/')
    }

  } else {
    res.render("connexion", { flash2: "Votre mot de passe de confirmation n'est pas conforme" })
  }
}

exports.getPageVerification = (req, res) => {
  const { token } = req.session
  console.log("voici le token", token);

  jwt.verify(token, "SecretKey", async (err, decoded) => {
    console.log("decoded", decoded);
    if (err) {
      console.log(err);
      res.send('Email de verification echoué, le lien est invalide');
    }
    else {
      const [user] = await db.query(`SELECT * FROM user WHERE id="${decoded.user.id}"`)
    
      if (!user) {
        console.log("pb user");
        res.redirect("/")
      } else {
        console.log('Email de verification success');
        db.query(`UPDATE user SET isVerified="1" WHERE id="${decoded.user.id}"`)
        res.redirect("/");
      }
    }
  });
}

// Affichage de la page Link
exports.getPageLink = (req, res) => {
  res.render("link")
}