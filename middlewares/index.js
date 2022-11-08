// Middlewares

// Page Home
exports.test_md = (req, res, next) => {
  console.log("Je suis le middleware de la page home");
  next();
};
// Page Connexion
exports.connexion = (req, res, next) => {
  console.log("je suis sur la page connexion");
  next();
};

// Connexion
exports.isBan = async (req, res, next) => {
    var email = req.body.email ? req.body.email : req.session.user.email
    const user = await db.query(`SELECT id FROM user WHERE email="${email}"`);
    const role = await db.query(`SELECT isBan FROM user WHERE id="${user[0].id}"`);
    (role[0].isBan == 1) ? res.render('home') : next();
}



exports.mdpForgot = async (req, res, next) => {
  console.log("mdp oublie");
  next();
};

// Page Profil
exports.profil = (req, res, next) => {
  console.log("page profil");
  next();
};

// Page editprofil
exports.editprofil = (req, res, next) => {
  console.log("page edit-profil");
  next();
};

// Update données
exports.updateProfil = (req, res, next) => {
  console.log("Modif effectue");
  next();
};

// Page Link
exports.link = (req, res, next) => {
  console.log("je suis sur la page link");
  next();
};

// Page Admin
exports.isAdmin = async (req, res, next) => {
  if (!req.session.user) return res.redirect("/");
  const [user] = await db.query(
    `SELECT isAdmin FROM user WHERE email="${req.session.user.email}"`
  );
 (user.isAdmin === 0) ? res.redirect("/edit-profil") : next();
};



// Ban User
exports.ban = (req, res, next) => {
  console.log("user bien ban");
  next();
};

// Page Forum
exports.forum = (req, res, next) => {
  console.log("page Forum");
  next();
};

// Envoi Commentaire
exports.envoiComment = (req, res, next) => {
  console.log("Commentaire bien envoye ");
  next();
};

// Modification Commentaire
exports.modifComment = (req, res, next) => {
  console.log("Commentaire Modifie");
  next();
};

// Suppression Commentaire
exports.suppComment = (req, res, next) => {
  console.log("Commentaire Supprime ");
  next();
};

/*
exports. = (req, res, next) => {
    console.log(' ');
    next()
}
*/

// Nodemailer
exports.nodemailer = (req, res, next) => {
  console.log("mail envoye");
  next();
};
