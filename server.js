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

const upload = require('./utils/multer')


const port = 3000;

// Déstructuration de process.env
const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, PORT_NODE } = process.env;

// Import des middlewares*
const { isAdmin } = require("./middlewares/middleware");
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


const ROUTER = require('./router')
app.use(ROUTER)


// CRUD CONNEXION
// Logout // Déconnexion
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('poti-gato');
    console.log("Clear Cookie session :", req.sessionID);
    res.redirect('/');
  })
})



/* --------------------
       /Forum
--------------------*/
//add comment // ajouter un commentaire
/*
app
  .post("/comments", upload.single('image'), async (req, res) => {
    const { commentary } = req.body;
    const image = req.file ? req.file.filename : false;

    if (image) await db.query(`INSERT INTO comments SET commentary="${commentary}", id_user="${req.session.user.id}" , image="${image}"`),
      console.log("image OK");
    else await db.query(`INSERT INTO comments SET commentary="${commentary}", id_user="${req.session.user.id}" , image=''`), console.log("image NOK");

    res.redirect("back");
  })
*/

// /Forum
// reply to comment // Répondre au commentaire
// a faire plus tard


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