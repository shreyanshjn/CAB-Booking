var express = require('express')
var router = express.Router()

var bookingControls = require('../../controllers/api/booking/bookingControls')
var riderMiddleware = require('../../middleware/rider/TokenMiddleware')
var driverMiddleware = require('../../middleware/driver/TokenMiddleware')

router.post('/bookRide', riderMiddleware.verifyToken, bookingControls.bookRide)
router.get('/confirmRide', driverMiddleware.verifyToken, bookingControls.confirmRide)
router.post('/driverConfirmation',driverMiddleware.verifyToken, bookingControls.driverConfirmation)
router.post('/bookingDetails', driverMiddleware.verifyToken, bookingControls.bookingDetails)
router.post('/bookingDetails2', riderMiddleware.verifyToken, bookingControls.bookingDetails)
router.post('/riderBookedStatus', riderMiddleware.verifyToken, bookingControls.riderBookedStatus)

module.exports = router
