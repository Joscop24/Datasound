// Middlewares

// Page Home
exports.test_md = (req, res, next) => {
    // if (!req.session.user) return res.redirect('/');
    console.log('Je suis le middleware de la page home')
    next()
}
// Page Connexion
exports.connexion = (req, res, next) => {
        console.log('je suis sur la page connexion')
    next()
}

// Connexion
exports.login = async (req, res, next) => {
    /*
    if (!req.session.user) return res.redirect('/')
    const user = await db.query(`SELECT isBan FROM user WHERE email="${req.session.user.email}"`);
    console.log('isadmin',  user);
    (req.session.user.isBan === 1) ? res.redirect('/') : next();
    */
   next()
}

exports.mdpForgot = async (req, res, next) => {
    console.log("mdp oublie");
    next()
}


// Inscription
exports.inscription = (req, res, next) => {
    console.log('inscription OK')
    next()
}

// Page Profil
exports.profil = (req, res, next) => {
    console.log('page profil')
    next()
}

// Page editprofil
exports.editprofil = (req, res, next) => {
    console.log('page edit-profil')
    next()
}

// Update données
exports.updateProfil = (req, res, next) => {
    console.log("Modif effectue")
    next()
}

// Page Link
exports.link = (req, res, next) => {
    console.log('je suis sur la page link')
    next()
}

// Page Admin
exports.imAdmin = async (req, res, next) => {
    if (!req.session.user) return res.redirect('/')
    // console.log("session user", req.session.user);
    const user = await db.query(`SELECT isAdmin FROM user WHERE email="${req.session.user.email}"`);
    // console.log("Etat de isAdmin" ,req.session.user.isAdmin);
    console.log('isadmin',  user);
    (req.session.user.isAdmin === 0) ? res.redirect('/profil') : next();
}

/*
// Info datas users
exports.datasusers = (req, res, next) => {
    console.log('balabal')
}
*/

// Ban User
exports.ban = (req, res, next) => {
    console.log("user bien ban")
    next()
}

// Page Forum
exports.forum = (req, res, next) => {
    console.log('page Forum');
    next()
}



// Envoi Commentaire
exports.envoiComment = (req, res, next) => {
    console.log('Commentaire bien envoye ');
    next()
}


// Modification Commentaire
exports.modifComment = (req, res, next) => {
    console.log('Commentaire Modifie');
    next()
}



// Suppression Commentaire
exports.suppComment = (req, res, next) => {
    console.log('Commentaire Supprime ');
    next()
}

/*
exports. = (req, res, next) => {
    console.log(' ');
    next()
}
*/

// Nodemailer
exports.nodemailer = (req, res, next) => {
    console.log('mail envoye');
    next()
}