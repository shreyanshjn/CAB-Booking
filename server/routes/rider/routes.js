var express = require('express')
var router = express.Router()

var riderAuth= require('../../controllers/api/rider/riderAuth')
var riderMiddleware = require('../../middleware/rider/TokenMiddleware')
var riderControls = require('../../controllers/api/rider/riderControls')

router.post('/register', riderAuth.registerRider)
router.post('/login', riderAuth.loginRider)
// router.get('/getDrivers', riderAuth.getActiveDriver)
router.get('/userData', riderMiddleware.verifyToken, riderAuth.isAuthenticated)
router.post('/updateLocation', riderMiddleware.verifyToken, riderControls.updateLocation)
router.post('/getLiveLocation', riderControls.getLiveLocation)

module.exports = router
