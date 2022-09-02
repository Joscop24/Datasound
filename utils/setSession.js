exports.setSession = async (req, res, email) => {
    // console.log('setSession', email)
    let userget = await db.query(`SELECT * FROM user WHERE email="${email}"`)
    let user = userget[0];

    db.query(`SELECT * FROM user WHERE email="${email}"`, (err, data) => {
        if (err) {
            console.log('err', err)
            res.end()
        }
        else {
            //  console.log('setSession2', data[0])
            req.session.user = {
                ...data[0]
            };
            
            delete req.session.user.password
            console.log("test",data[0]);
            res.redirect('/link')
        }
    })
}