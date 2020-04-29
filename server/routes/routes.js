var express= require('express')
var router  = express.Router()

var test    = require('./test/routes')
var driver  = require('./driver/routes')

router.use('/api/test', test)
router.use('/api/driver', driver)

module.exports = router
