var express = require('express')
var router = express.Router()

var riderAuth= require('../../controllers/api/rider/riderAuth')
var riderMiddleware = require('../../middleware/rider/TokenMiddleware')

router.post('/register', riderAuth.registerRider)
router.post('/login', riderAuth.loginRider)
router.get('/getDrivers', riderAuth.getActiveDriver)
router.get('/userData', riderMiddleware.verifyToken, riderAuth.isAuthenticated)

module.exports = router
