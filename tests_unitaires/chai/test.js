// Imports des Modules
const chaiHttp = require("chai-http")
const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const { app } = require("../../server")
const { data } = require("../../controllers/forum.controller")
const path = require("path")
chai.use(chaiHttp)


describe('CHAI // CONTROLLER // COMMENTS', () => {
    let cookieSess;
    let id;

    // Ping
    it('PING', (done) => {
        chai
            .request(app)
            .get('/ping')
            .end((err, res) => {
                if (err) return done(err);
                res.body.data.should.be.a('object');
                res.should.have.status(200);

                done()
            })
    });

    // Login
    it(" CHAI // POST // LOGIN", (done) => {
        chai
            .request(app)
            .post("/login")
            .set("Accept", "application/json")
            .send({ email: "jorisbourdin.pro@gmail.com", password: "Jos24" })
            .end((err, res) => {
                cookieSess = res.res.headers['set-cookie'][0].split(';')[0]
                if (err) return done(err);

                res.should.have.status(200);
                done();
            });
    })

    // GET
    it('CHAI // CONTROLLEUR // GET', (done) => {
        chai
            .request(app)
            .get('/forum')
            .set("Cookie", cookieSess)
            .end((err, res) => {
                if (err) return done(err);

                res.body.data.should.be.a('array');
                res.should.have.status(200);
                done()
            })

    });

    // Post
    it('CHAI // POST // COMMENTS', (done) => {
        chai
            .request(app)
            .post('/comments')
            .set("Accept", "application/json")
            .set("Cookie", cookieSess)
            .field("Content-Type", "multipart/form-data")
            .field("id_comment", "285")
            .field("id_user", "2")
            .attach("image", path.resolve(__dirname, "../../public/images/img.png"))
            .end((err, res) => {
                if (err) return done(err);
                res.body.data.should.be.a('object');
                id = res.body.data
                res.should.have.status(200)

                done()
            })
    });

    // // GET ID
    it('CHAI // GET ID // COMMENTS', (done) => {
        chai
            .request(app)
            .get(`/comments/${id.insertId}`)
            .set("Cookie", cookieSess)
            .end((err, res) => {
                if (err) return done(err),

                    res.body.data.should.be.a('array');
                res.should.have.status(200)
                done()
            })
    });





    // PUT
    it('CHAI // PUT // COMMENTS', (done) => {
        chai
            .request(app)
            .put(`/comments/${id.insertId}`)
            .set("Accept", "application/json")
            .set("Cookie", cookieSess)
            .field("Content-Type", "multipart/form-data")
            .field("id_comment", `${id.insertId}`)
            .field("id_user", "2")
            .attach("image", path.resolve(__dirname, "../../public/images/kekra.jpeg"))
            .end((err, res) => {
                if (err) return done(err)

                res.body.data.should.be.a('object');
                res.should.have.status(200)
                done()
            })
    })

    // // DELETE
    it('CHAI // DELETE // COMMENTS', (done) => {
        // console.log('iki', id);
        chai
            .request(app)
            .delete(`/comments/${id.insertId}`)
            .set("Accept", "application/json")
            .set("Cookie", cookieSess)
            .end((err, res) => {
                if (err) return done(err)

                res.should.have.status(200)
                done()
            })
    })


})