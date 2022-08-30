// Import Module Global
require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");
const expressSession = require("express-session");
const MySQLStore = require("express-mysql-session")(expressSession);
const { setSession } = require("./utils/setSession");
const transporter = require("./config/nodemailer");

const upload = require('./utils/multer')

const port = 3000;

// Déstructuration de process.env
const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, PORT_NODE } = process.env;

// Import des middlewares*
const { isAdmin } = require("./middleware");
const app = express();

/*
 * Configuration Handlebars
 ***************************/

//Import des helpers
const { limit, ifImgExist } = require("./helper");

app.engine(
  ".hbs",
  engine({
    helpers: {
      limit, ifImgExist
    },
    extname: "hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");
app.set("views", "./views");

/*
 * Config mysql
 ***************/
let configDB = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
};

db = mysql.createConnection(configDB);

// Connexion de la db mysql
db.connect((err) => {
  if (err) console.error("error connecting: ", err.stack);
  console.log("connected as id ", db.threadId);
});

/*
 * Config method override
 *************************/
app.use(methodOverride("_method"));

/*
 * Config Body-parser
 *********************/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/*
 * Configuration de la route vers notre dossier static
 ******************************************************/
app.use("/assets", express.static("public"));

var sessionStore = new MySQLStore(configDB);
app.use(
  expressSession({
    secret: "securite",
    name: "poti-gato",
    saveUninitialized: true,
    resave: false,
    store: sessionStore,
  })
);
// Session Connexion for HBS
app.use("*", (req, res, next) => {
  res.locals.user = req.session.user;
  next();
});


/*
 * Configuration Route
 ***************************/
// Connexion page
app.get("/connexion", (req, res) => {
  res.render("connexion");
});

/* --------------------
    CRUD CONNEXION
   -------------------- */
const bcrypt = require("bcrypt");
const { getMaxListeners } = require("process");
const bcrypt_salt = 10;

//  Login // Connexion
app.post("/login", function (req, res) {
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
});


//  Register //Inscription
app.post("/register", (req, res) => {
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
});

// Logout // Déconnexion
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('poti-gato');
    console.log("Clear Cookie session :", req.sessionID);
    res.redirect('/');
  })
})



app.get("/link", function (req, res) {
  res.render("link");
});

app.get("/profil", function (req, res) {
  res.render("profil");
});


/*
  CRUD: UPDATE PROFIL
*/
// Obtenir les informations sur l'utilisateur
app
  .get("/edit-profil", (req, res) => {
    db.query(`SELECT * FROM user`, function (err, data) {
      // console.log("refresh page", data);
      if (err) throw err;

      res.render("edit-profil", {
        db: data
      });
    });
  })

  // Mettre à jour mes données
  .put("/update/:id", (req, res) => {
    const { id } = req.params;
    const { newusername, email, newpassword, confirmpassword } = req.body;

    if (newpassword === confirmpassword) {
      bcrypt.hash(newpassword, bcrypt_salt, async (err, newhash) => {

        if (newusername) await db.query(`UPDATE user SET username="${newusername}" WHERE id=${id}`)
        if (email) await db.query(`UPDATE user SET email="${email}" WHERE id=${id}`)
        if (newpassword) await db.query(`UPDATE user SET password="${newhash}" WHERE id=${id}`)

        console.log(req.session);
        db.query(`SELECT * FROM user WHERE id=${req.session.user.id};`, (err, data) => {
          console.log("user", data)
          req.session.user = {
            ...data[0]
          };
          res.redirect("/edit-profil");
        })

      });
    } else {
      res.render("edit-profil", { flash3: "Votre mot de passe de confirmation n'est pas conforme" })
    }

  })





/*
        CRUD ADMIN
*/
// AFFICHER LES USERS DANS LA PAGE ADMIN
app
  .get("/admin", async (req, res) => {
    await db.query(`SELECT * FROM user`, function (err, data) {
      if (err) throw err;

      res.render("admin", {
        db: data,
        user: true,
      });
    });
  })
  .post("/user", async (req, res) => {
    const { username, name, email } = req.body;

    await db.query(
      `INSERT INTO user (username, name , email) VALUES ("${username}", "${name}", "${email}")`,
      function (err, data) {
        if (err) throw err;

        let body = req.body;
        res.redirect("back");
      }
    );
  })



  /* --------------------
   Delete users / Suppression utilisateurs
    -------------------- */
  .delete("/user/:id", async (req, res) => {
    const { id } = req.params;

    // Supression de l'article par rapport a son id
    await db.query(`DELETE FROM user WHERE id=${id}`, function (err, data) {
      if (err) throw err;

      // Redirection vers la page admin
      res.redirect("/admin");
    });
  });







/* --------------------
       /Forum
--------------------*/
//add comment // ajouter un commentaire
app
  .get("/forum", (req, res) => {
    db.query(`SELECT * FROM user INNER JOIN comments ON user.id = comments.id_user`, (err, data) => {
      if (err) console.log(err)
      // console.log('page forum', data)
      res.render("forum", {
        db: data
      });
    })

  })

  .post("/comments", upload.single('image'), async (req, res) => {
    console.log('Create comment (IMG)', req.file)
    const { commentary, id_user } = req.body;
    const { id_comments } = req.params;
    const image = req.file ? req.file.filename : false;

    if (image) await db.query(`INSERT INTO comments SET commentary="${commentary}", id_user="${req.session.user.id}" , image="${image}"`),
    console.log("image OK");
  else await db.query(`INSERT INTO comments SET commentary="${commentary}", id_user="${req.session.user.id}" , image=''`), console.log("image NOK");
        
        res.redirect("back");
  })



  // edit comment // mofifier le commentaire
  .put("/comments/:id_comments", async (req, res) => {
    let body = req.body;
    const { id_comments } = req.params;
    const { newcommentary } = body;

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
  })



  // delete comment // supprimer le commentaire
  .delete("/comments/:id_comments", async (req, res) => {
    const { id_comments } = req.params;

    // Supression de l'article par rapport a son id
    await db.query(
      `DELETE FROM comments WHERE id_comments=${id_comments}`,
      function (err, data) {
        if (err) throw err;

        res.redirect("/forum");
      }
    );
  });

// reply to comment // Répondre au commentaire
// a faire plus tard




//Nodemailer
app
  .post('/mail', async (req, res) => {
    try {
      const { mail, objet, message } = req.body;

      // etape 3
      if (!mail || !objet || !message) return res.redirect('/')

      const data = await transporter.sendMail({
        from: '"Joris" <jorisbourdin.pro@gmail.com>',
        to: 'jorisbourdin.pro@gmail.com',
        subject: `Datasound + ${objet}`,
        html: `
                <h3> Le mail du destinataire: ${mail}</h3>
                <h3> son message : ${message}</h3>
            `
      })

      console.log("Email bien envoyé !!", data)
      res.redirect("back")
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }

  })

const ROUTER = require('./router')
app.use(ROUTER)

/* ERROR 404 */
// A Mettre a la fin
app.get("/*", function (req, res) {
  res.render("error404", {
    user: true,
  });
});

app.listen(port, () =>
  console.log(`Joris : lancement du site sur le port ${port} !`)
);