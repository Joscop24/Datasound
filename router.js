const express = require('express')
const router = express.Router()


// Import controllers
const { getPageHome } = require('./controllers/home.controllers')
// Import middlewares
const { test_md } = require('./middlewares')

router.route('/')
    .get(test_md, getPageHome)



module.exports = router

