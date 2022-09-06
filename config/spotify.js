// /**
//  * This is an example of a basic node.js script that performs
//  * the Authorization Code oAuth2 flow to authenticate against
//  * the Spotify Accounts.
//  *
//  * For more information, read
//  * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
//  */

// var express = require('express');
// var cors = require('cors');
// var querystring = require('querystring');
// var cookieParser = require('cookie-parser');

// var client_id = 'd0f7e1ad3b7748cf9b2505355d27202e'; // Your client id
// var client_secret = '13b9507918564a3fbcd04947401d8b2c'; // Your secret
// var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri


// /**
//  * Generates a random string containing numbers and letters
//  * @param  {number} length The length of the string
//  * @return {string} The generated string
//  */
// var generateRandomString = function (length) {
//     var text = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//     for (var i = 0; i < length; i++) {
//         text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
// };

// var stateKey = 'spotify_auth_state';

// var app = express();

// app.use(express.static(__dirname + '/public'))
//     .use(cors())
//     .use(cookieParser());

// app.get('/login', function (req, res) {

//     var state = generateRandomString(16);
//     res.cookie(stateKey, state);

//     // your application requests authorization
//     var scope = 'user-read-private user-read-email';
//     res.redirect('https://accounts.spotify.com/authorize?' +
//         querystring.stringify({
//             response_type: 'code',
//             client_id: client_id,
//             scope: scope,
//             redirect_uri: redirect_uri,
//             state: state
//         }));
// });