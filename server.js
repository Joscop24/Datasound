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



/*
 * Configuration Handlebars
 ***************************/

//Import des helpers
const { limit, ifImgExist } = require("./helper");

app.engine(
  ".hbs",
  engine({
    helpers: {
      limit,
      ifImgExist,
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

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
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
  var scope = "user-read-private user-read-email";
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
  console.log("Callback spotify");

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  console.log("CHECK code", code);

  if (state === null || state !== storedState) {
    console.log("Callback spotify 2");
    res.redirect(
      "/#" +
      querystring.stringify({
        error: "state_mismatch",
      })
    );
  } else {
    console.log("Callback spotify 3", code);
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
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };
    console.log("callback", authOptions);

    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };
        // console.log("headhead", options.headers);
        /*
                use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                  res.json({
                    body
                  })
                  console.log("Voici les infos sur mon compte Spotify", body);
                });
        */
        const data = await request.get(
          options,
          function (error, response, body) {
            console.log("Voici les infos sur mon compte Spotify", body);
          }
        );

        // console.log("request auth spotify", data);

        res.render("profil", { data });
        /*
        res.json({
          body
        })
        we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
        */
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


// GETTOPARTISTS
app.get("/topArtists", function (req, res) {
  var scope = "user-top-read";
  var type = "artists"
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;


  var authOptions = {
    url: "https://api.spotify.com/v1/me/top/" + type,
    form: {
      Accept: "application/json",
      Contenttype: "appplication/json",
    },
    headers: {
      Authorization:
        "Bearer " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    json: true,
  };

  console.log("COUCOU JE SUIS LA", authOptions);
  request.post(authOptions, async function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.redirect("/# " + querystring.stringify({ error: invalid_ }))

      // var options = {
      //   url: "https://api.spotify.com/v1/me/top/",
      //   form: {
      //     type: "artists",
      //   },
      //   headers: {
      //     Authorization:
      //       "Bearer " +
      //       new Buffer(client_id + ":" + client_secret).toString("base64"),
      //   },
      //   json: true,
      // };
      console.log("COUCOU JE SUIS LA 222", options);

      // const data = await request.get(options, function (error, response, body) {
      //   console.log("BEST ARTIST", body);
      // });

      // console.log("request top artist");

      // res.render("profil", { data });
    } else {
      console.log("TOUT EST OK", authOptions);
      const data = await request.get(authOptions, (error, response, body) => {
        console.log("Voici les infos sur les top artists", body);
        res.json({ data });
      })
    }
  });
});

// END SPOTIFY*




// /Forum
// reply to comment // Répondre au commentaire
// a faire plus tard

/* ERROR 404 */
// A Mettre a la fin
// app.get("/*", function (req, res) {
//   res.render("error404", {
//     user: true,
//   });
// });

app.listen(port, () =>
  console.log(`Joris : lancement du site sur le port ${port} !`)
);

// exports pour chai
module.exports = { db, app };
