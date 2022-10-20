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
var Buffer = require('buffer/').Buffer

const upload = require("./utils/multer");

var request = require("request"); // "Request" library


// Import des middlewares*
// const { isAdmin } = require("./middlewares/index");
const app = express();



// Swagger Configuration
const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./config/api/swagger.json')

// Générateur Swagger // Uncomment pour crée le json
// const expressOasGenerator = require('express-oas-generator');
// expressOasGenerator.init(app, {})


// Déstructuration de process.env
const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, PORT_NODE } = process.env;

const port = PORT_NODE;

//Import des helpers
const { limit, ifImgExist, orderImage } = require("./helper");

app.engine(
  ".hbs",
  engine({
    helpers: {
      limit, ifImgExist, orderImage
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

// Config ASYNC
const util = require("util");
db.query = util.promisify(db.query).bind(db);

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
  // console.log('md sess', req.session)
  next();
});


/*
ROUTER DE L'APPLICATION
*/
app.use('/api/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const ROUTER = require("./router");
const { response } = require("express");
const { get } = require("./router");
app.use("/", ROUTER);
// ROUTE pour Swagger

// CRUD CONNEXION
// Logout // Déconnexion
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("poti-gato");
    console.log("Clear Cookie session :", req.sessionID);
    res.redirect("/");
  });
});



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

// exports pour chai
module.exports = { db, app };
