var express = require('express')
var router = express.Router()

var testRoute = require('../../controllers/api/test/testControl')

//api/test
router.get('/test1', testRoute.testControl)

module.exports = router
