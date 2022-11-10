const express = require("express");
const router = express.Router();
const upload = require("./utils/multer");

// const { isAdmin } = require("./middlewares/middleware");

// Import controllers
const { getPageHome } = require("./controllers/home.controllers");
const {
  getPageAuth,
  getPageLink,
  getConnexionUser,
  getInscriptionUser,
  getPageVerification,
  lostPassword,
  getPageResetPassword,
  resetPassword,
  logout
} = require("./controllers/auth.controller");
const {
  getPageProfil,
  getEditProfil,
  putUpdateProfil,
} = require("./controllers/user.controlllers");
const { getPageAdmin, banUser } = require("./controllers/admin.controller");
const {
  getPageForum,
  editComment,
  getCommentId,
  deleteComment,
  sendComment,
  getPing,
} = require("./controllers/forum.controller");
const { envoiMail } = require("./controllers/nodemailer.controller");
// const { getTopArtist } = require("./utils/spotify")
const {
  getLoginSpotify,
  callback,
  getTopArtist,
  getTopTracks,
} = require("./controllers/spotify.controller");
// const { commentary } = require ('./utils/multer')

// Import middlewares
const {
  test_md,
  connexion,
  link,
  isBan,
  inscription,
  profil,
  editprofil,
  updateProfil,
  isAdmin,
  ban,
  forum,
  modifComment,
  suppComment,
  nodemailer,
  envoiComment,
  mdpForgot,
} = require("./middlewares/index");

/*
 * Routes
 * ****** */

router.route("/ping").get(getPing);

/*
// Auth Controlleurs
*/
// Home
router.route("/").get(test_md, getPageHome);
// Connexion
router.route("/connexion").get(connexion, getPageAuth);

// lostPassword
router.route("/lostpassword").post(mdpForgot, lostPassword);

// Page ResetPassword
router.route("/resetPassword").get(getPageResetPassword).put(resetPassword);

// Login
router.route("/login").post(isBan, getConnexionUser);

// Inscription
router.route("/register").post(getInscriptionUser);

// Logout
router.route("/logout").post(logout)

// Activation / Verification
router.route("/verification/:token").get(getPageVerification);

/*
// User Controlleur
*/
// Link (Spotify)
router.route("/link").get(link, getPageLink);

router.route("/login_spotify").get(getLoginSpotify);

router.route("/callback").get(callback);

// Page Profil (stats spotify)
router.route("/profil").get(getTopArtist);
// Page Edit-Profil
router.route("/edit-profil").get(editprofil, getEditProfil);
// Effectuer l'update du profil
router.route("/update/:id").put(updateProfil, putUpdateProfil);

/*
// Admin Controlleur
*/
router.route("/admin").get(isAdmin, getPageAdmin );

// Supprimer les utilisateurs => à modifier pour leur empecher de se connecter
router.route("/user/:id").delete(ban, banUser);

/*    
// Forum Controlleur
*/
router.route("/forum").get(forum, getPageForum);

// Envoi Comment
router
  .route("/comments")
  .post(upload.single("image"), sendComment, envoiComment);

router
  .route("/comments/:id_comments")
  //
  .get(getCommentId)
  // Modification du commentaire
  .put(modifComment, editComment)
  // Suppression du commentaire
  .delete(suppComment, deleteComment);

/*
// Nodemailer Controlleur
*/
router.route("/mail").post(nodemailer, envoiMail);

//Exports du module router => server.js
module.exports = router;
