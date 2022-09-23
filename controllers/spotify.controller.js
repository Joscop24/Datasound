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

// Information Spotify
var client_id = "d0f7e1ad3b7748cf9b2505355d27202e"; // Your client id
var client_secret = "13b9507918564a3fbcd04947401d8b2c"; // Your secret
var redirect_uri = "http://localhost:3000/callback"; // Your redirect uri

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

// EXPORTS 
exports.getLoginSpotify = function (req, res) {
console.log("aaaaaaaaaaaaaaaaaaa");

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
exports.callback = function (req, res) {
// app.get("callback"),
    console.log("bbbbbbbbbbbbbbbbbbbbbbbb");

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
console.log("ccccccccccccccccccccc");
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