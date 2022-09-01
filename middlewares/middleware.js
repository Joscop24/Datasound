// let user = true;

// module.exports = {
//   isAdmin: async (req, res, next) => {
//     if(!req.session.user) return res.redirect('/admin')
//     const [user] = await db.query(`SELECT isAdmin FROM user WHERE email="${req.session.user.email}"`);
//     console.log(user);
//     ( user.isAdmin === req.session.user.isAdmin && user.isAdmin === 0 ) ? res.redirect('/link') : next();
//   }
// }