// Imports des Modules
const chaiHttp = require("chai-http")
const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const { app } = require("../../server")
const { data } = require("../../controllers/forum.controller")
const path = require("path")
chai.use(chaiHttp)
// FAIRE LE DESCRIBE 

describe('CHAI // CONTROLLER // PING', () => {
    // console.log("info data", data);

    it('getPing', (done) => {
        chai
            .request(app)
            .get('/ping')
            .end((err, res) => {
                if (err) return done(err);

                // console.log(res.body);
                res.body.data.should.be.a('object');
                res.should.have.status(200);

                done()
            })
    });


  // Test Route POST Login
  it(" ChaiRouter // POST // Login", (done) => {
    chai
        .request(app)
        .post("/login")
        .set("Accept", "application/json")
        .send({email: "Joris@gmail.com", password: "Jos24"})
        .end((err, res) => {
            cookieSess = res.res.headers['set-cookie'][0].split(';')[0]
            if (err) return done(err);
            res.should.have.status(200);
            // console.log("cookie", cookieSess);
            done();
        });
});


    it('getPageForum', (done) => {
        chai
            .request(app)
            .get('/forum')
            .end((err, res) => {
                if (err) return done(err);

                // console.log("eeee",res);
                res.body.data.should.be.a('array');
                res.should.have.status(200);
            
                done()
            })

    });

    it('sendComment', (done) => {
        chai
            .request(app)
            .get('/comments')
            // Content-Type
            .field("image", "multipart/form-data")
            .attach("image", path.resolve(__dirname, "./img.png"))
            .end((err, res) => {
                if (err) return done(err);

                console.log("body", res.body);
                res.body.data.should.be.a('array');
                res.should.have.status(200)

                done()
            })
    });

    it('editComment', (done) => {
        chai
            .request(app)
            .get('/comments/:id_comments')
            .end((err, res) => {
                if (err) return done(err),

                res.body.data.should.be.a('object');
                res.should.have.status(200)

                done()
            })
    });
})