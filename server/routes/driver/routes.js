var express = require('express')
var router = express.Router()

var driverAuth = require('../../controllers/api/driver/driverAuth')
var driverControls = require('../../controllers/api/driver/driverControls')
var driverMiddleware = require('../../middleware/driver/TokenMiddleware')

router.post('/register', driverAuth.registerDriver)
router.post('/login', driverAuth.loginDriver)
router.post('/setActive', driverMiddleware.verifyToken, driverAuth.setActive)
router.get('/userData', driverMiddleware.verifyToken, driverAuth.isAuthenticated)
router.post('/updateLocation', driverMiddleware.verifyToken, driverControls.updateLocation)
router.post('/toggleActiveStatus', driverMiddleware.verifyToken, driverControls.toggleActiveStatus)
router.post('/setDriverInactive', driverMiddleware.verifyToken, driverControls.setDriverInactive)
router.post('/setDriverActive', driverMiddleware.verifyToken, driverControls.setDriverActive)
router.get('/activeDrivers', driverControls.getActiveDriver)
router.post('/getLiveLocation', driverControls.getLiveLocation)

module.exports = router
