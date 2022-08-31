const express = require('express')
const router = express.Router()


// Import controllers
const { getPageHome } = require('./controllers/home.controllers')
const { getPageAuth, getPageLink, getConnexionUser, getInscriptionUser } = require('./controllers/auth.controller')
const { getPageProfil, getEditProfil, putUpdateProfil } = require('./controllers/user.controlllers')
const { getPageAdmin, banUser } = require ('./controllers/admin.controller')
const { getPageForum, editComment, deleteComment } = require('./controllers/forum.controller')
const { envoiMail } = require('./controllers/nodemailer.controller')


// Import middlewares
const { test_md, connexion, link, login, inscription, profil, editprofil, updateProfil, admin, ban, forum, modifComment, suppComment, nodemailer } = require('./middlewares')


/*
 * Routes
 * ****** */

/*
// Auth Controlleurs
*/
// Home
router.route('/')
    .get(test_md, getPageHome)
// Connexion
router.route('/connexion')
    .get(connexion, getPageAuth)
// Login
router.route('/login')
    .post(login, getConnexionUser)
// Inscription
router.route('/register')
    .post(inscription, getInscriptionUser)

/*
// User Controlleur
*/
// Link (Spotify)
router.route('/link')
    .get(link, getPageLink)
// Page Profil (stats spotify)
router.route('/profil')
    .get(profil, getPageProfil)
// Page Edit-Profil
router.route('/edit-profil')
    .get(editprofil, getEditProfil)
// Effectuer l'update du profil
router.route('/update/:id')
    .put(updateProfil, putUpdateProfil)

/*
// Admin Controlleur
*/
router.route('/admin')
    .get(admin, getPageAdmin)
// Supprimer les utilisateurs => à modifier pour leur empecher de se connecter
router.route('/user/:id')
    .delete(ban, banUser)

/*    
// Forum Controlleur
*/
router.route('/forum')
    .get(forum, getPageForum)
// Modification du commentaire
router.route('/comments/:id_comments')
    .put(modifComment, editComment )
// Suppression du commentaire
router.route('/comments/:id_comments')
    .delete(suppComment, deleteComment)

/*
// Nodemailer Controlleur
*/
router.route('/mail')
    .post(nodemailer, envoiMail)


//Exports du module router => server.js     
module.exports = router

