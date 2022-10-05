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





// SPOTIFY
var cors = require("cors");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");

var client_id = "d0f7e1ad3b7748cf9b2505355d27202e"; // Your client id
var client_secret = "13b9507918564a3fbcd04947401d8b2c"; // Your secret
var redirect_uri = "http://localhost:3000/callback"; // Your redirect uri

const port = 3000;

// Déstructuration de process.env
const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, PORT_NODE } = process.env;


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




// SPOTIFY

/*
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
*/
/*
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.get("/login_spotify", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = "user-read-private user-read-email user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    })
  );
});


// CallBACK
app.get("/callback", function (req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  // console.log("CHECK code", code);

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
      querystring.stringify({
        error: "state_mismatch",
      })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };
        const data = await request.get(options, function (error, response, body) {
          // res.status(200).send({datas:body})
          console.log("Voici les infos sur mon compte Spotify", body);
          console.log("voici les infos concernant le token", options);
        }
        );
        req.session.token = data.headers.Authorization
        res.render("profil", { data: data });



      } else {
        res.redirect(
          "/#" +
          querystring.stringify({
            error: "invalid_token",
          })
        );
      }
    });
  }
});



app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

*/
/*
// GetTopArtists default:medium_range == 6 Months
app.get('/getTopArtist', async (req, res) => {
  const token = req.session.token
  const result = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  })
  // console.log("resultat", result);

  const datas6M = await result.json()
  let topArray = []
  console.log("Infos Artists", datas6M);
  // console.log("vla le lien d'un image", datas6M.items[0].images[1].url);

  datas6M.items.map((itm, i) => {
    // console.log('loop', i)
    if (i <= 2) topArray.push({
      ...itm,
      images: itm.images[0]
    })
  })
  // datas6M.items.map((item, index) => {
  //   console.log(item.name, index);
  // })
  // res.status(200).send({datas:datas6M})
  res.render("profil", {
    db: datas6M,
    topArray
  })
})

app.get('/getTopTracks', async (req,res) => {
  const token = req.session.token
  const result = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  })
  
  const datasT6M = await result.json()
  console.log("aaaaaaaaaaaaaaaaaaaaaa", datasT6M.items[1].name);
  let topArrayTracks = []
  datasT6M.items.map((itm, i) => {
    if(i <= 2) topArrayTracks.push({
      ...itm,
      images: itm.album.images[0]
    })
  })
  
  // res.status(200).send({datas:datasT6M})
  
  res.render("profil", {
    db2: datasT6M,
    topArrayTracks
  })
  
})
*/



// END SPOTIFY*




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
