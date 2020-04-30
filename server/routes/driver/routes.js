var express = require('express')
var router = express.Router()

var driverAuth = require('../../controllers/api/driver/driverAuth')
var driverMiddleware = require('../../middleware/driver/TokenMiddleware')

router.post('/register', driverAuth.registerDriver)
router.post('/login', driverAuth.loginDriver)
router.post('/active', driverMiddleware.verifyToken, driverAuth.activeDriver)
router.get('/userData', driverMiddleware.verifyToken, driverAuth.isAuthenticated)

module.exports = router
