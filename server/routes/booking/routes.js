var express = require('express')
var router = express.Router()

var bookingControls = require('../../controllers/api/booking/bookingControls')
var riderMiddleware = require('../../middleware/rider/TokenMiddleware')
var driverMiddleware = require('../../middleware/driver/TokenMiddleware')

router.post('/bookRide', riderMiddleware.verifyToken, bookingControls.bookRide)
router.get('/availableRides', driverMiddleware.verifyToken, bookingControls.availableRides)
router.post('/driverConfirmation',driverMiddleware.verifyToken, bookingControls.driverConfirmation)
router.post('/bookingDetails', driverMiddleware.verifyToken, bookingControls.bookingDetails)
router.post('/bookingDetails2', riderMiddleware.verifyToken, bookingControls.bookingDetails)
router.get('/riderBookedStatus', riderMiddleware.verifyToken, bookingControls.riderBookedStatus)
router.post('/endRide', driverMiddleware.verifyToken, bookingControls.endRide)

module.exports = router
