/*
    Spotify Controlleur
*/
//Import des Modules
const express = require("express");
var Buffer = require('buffer/').Buffer

const app = express();

var cors = require("cors");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
var request = require("request"); // "Request" library

// Information Spotify
var client_id = "d0f7e1ad3b7748cf9b2505355d27202e"; // Your client id
var client_secret = "13b9507918564a3fbcd04947401d8b2c"; // Your secret
var redirect_uri = "http://localhost:3000/callback"; // Your redirect uri

// SPOTIFY

/*
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

// EXPORTS 
exports.getLoginSpotify = function (req, res) {

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
};


// CallBACK
// exports.callback =
exports.callback = (req, res) => {

    // your application requests refresh and access tokens
    // after checking the state parameter

    // PB COOKIE DANS STOREDSTATE
    // J'AI CHAINTE LE TEST POUR POUVOIR CONTINUER
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : state; // null


    if (state === null ) {
        // || state !== storedState
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
                  const ppUser = body.images[0].url     
                  req.session.token = data.headers.Authorization
                  // res.status(200).send(ppUser)
                  // console.log(body.images[0].url);
                  res.render("profil", { data: data, body: ppUser});

                  // console.log("Voici les infos sur mon compte Spotify", body);
                    // console.log("voici les infos concernant le token", options);
                  }
                  );
                  // req.session.token = data.headers.Authorization
                  // res.render("profil", { data: data });


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
};



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

// GetTopArtists default:medium_range == 6 Months
exports.getTopArtist = async (req, res) => {
    const token = req.session.token

/*
************** 4 SEMAINES **********************
                                            */
    // ARTISTES
    const resultArtist4W = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })
      // console.log("resultat", result);
    
      const datasArtist4W = await resultArtist4W.json()
      let topArrayArtists4W = []
    //   console.log("Infos Artists", datasArtist4W);
      // console.log("vla le lien d'un image", datas6M.items[0].images[1].url);
    
      datasArtist4W.items.map((itm, i) => {
        // console.log('loop', i)
        if (i <= 2) topArrayArtists4W.push({
          ...itm,
          images: itm.images[0]
        })
      })

    // TRACKS
    const resultTracks4W = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })
      const datasTracks4W = await resultTracks4W.json()
    //   console.log("Info Tracks", datasTracks4W);
      let topArrayTracks4W = []
      datasTracks4W.items.map((itm, i) => {
        if(i <= 2) topArrayTracks4W.push({
          ...itm,
          images: itm.album.images[0]
        })
      })
    






/*
************** 6 MOIS **********************
                                            */
    // ARTISTES
    const resultArtist6M = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
    // console.log("resultat", result);
  
    const datasArtist6M = await resultArtist6M.json()
    let topArrayArtists6M = []
    // console.log("Infos Artists", datas6M);
    // console.log("vla le lien d'un image", datas6M.items[0].images[1].url);
  
    datasArtist6M.items.map((itm, i) => {
      // console.log('loop', i)
      if (i <= 2) topArrayArtists6M.push({
        ...itm,
        images: itm.images[0]
      })
    })


    // TRACKS
    const resultTracks6M = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })
      const datasTracks6M = await resultTracks6M.json()
    //   console.log("Info Tracks", datasT6M);
      let topArrayTracks6M = []
      datasTracks6M.items.map((itm, i) => {
        if(i <= 2) topArrayTracks6M.push({
          ...itm,
          images: itm.album.images[0]
        })
      })


/*
************** ALL TIME **********************
                                            */


// ARTISTES
const resultArtistAL = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token,
  },
})
// console.log("resultat", result);

const datasArtistAL = await resultArtistAL.json()
let topArrayArtistsAL = []
// console.log("Infos Artists", datas6M);
// console.log("vla le lien d'un image", datas6M.items[0].images[1].url);

datasArtistAL.items.map((itm, i) => {
  // console.log('loop', i)
  if (i <= 2) topArrayArtistsAL.push({
    ...itm,
    images: itm.images[0]
  })
})

// TRACKS
const resultTracksAL = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token,
  },
})
const datasTracksAL = await resultTracksAL.json()
//   console.log("Info Tracks", datasT6M);
let topArrayTracksAL = []
datasTracksAL.items.map((itm, i) => {
  if(i <= 2) topArrayTracksAL.push({
    ...itm,
    images: itm.album.images[0]
  })
})



// A4W = Artists 4 Weeks
// T4W = Tracks 4 Weeks
    res.render("profil", {
    dbA4W: datasArtist4W, topArrayArtists4W,
    dbT4W: datasTracks4W,  topArrayTracks4W,
    dbA6M: datasArtist6M, topArrayArtists6M,
    dbT6M: datasTracks6M, topArrayTracks6M,
    dbAAL: datasArtistAL, topArrayArtistsAL,
    dbTAL: datasTracksAL, topArrayTracksAL
    })
  };
