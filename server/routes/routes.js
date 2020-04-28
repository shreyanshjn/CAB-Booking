var express= require('express')
var router  = express.Router()

var test    = require('./test/routes')

router.use('/api/test', test)

module.exports = router
