var express = require('express')
var router = express.Router()

var driverAuth = require('../../controllers/api/driver/driverAuth')

router.post('/register', driverAuth.registerDriver)
router.post('/login', driverAuth.loginDriver)

module.exports = router
