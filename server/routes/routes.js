var express= require('express')
var router  = express.Router()

var test    = require('./test/routes')
var driver  = require('./driver/routes')
var rider = require('./rider/routes')

router.use('/api/test', test)
router.use('/api/driver', driver)
router.use('/api/rider', rider)

module.exports = router
