var express = require('express')
var router = express.Router()

var riderAuth= require('../../controllers/api/rider/riderAuth')

router.post('/register', riderAuth.registerRider)
router.post('/login', riderAuth.loginRider)

module.exports = router
