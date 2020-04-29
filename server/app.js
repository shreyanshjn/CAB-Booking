require('dotenv').config()
var http  = require('http')
var express = require('express')
var path    = require('path')
var logger  = require('morgan')
var bodyParser = require('body-parser')
var cors = require('cors')
var mongoose =require('mongoose')
var routes = require('./routes/routes')
var app=express()

// mongoose.Promise = require('bluebird')
const uri = `mongodb+srv://shreyansh:${process.env.mongoDbPass}@cluster0-wfbhz.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.set('useCreateIndex', true) // To remove this warning. DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose
    // .connect(uri, {promiseLibrary: require('bluebird'), useNewUrlParser: true, useUnifiedTopology: true  })
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true  })
    .then (()=> console.log('connection successful'))
    .catch((err)=> console.log(err))

//for logging request information on development mode
app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({limit: '250kb'})) //for parsing json data

app.use(cors())

app.use(express.static(path.join(__dirname, '..',  'build')))

app.get('/static/*.js', function (req, res, next) {
    req.url = req.url + '.gz'
    res.set('Content-Encoding', 'gzip')
    res.set('Content-Type', 'text/javascript')
    next()
})

app.use(routes)

// catch 404 error and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not found')
    err.status = 404
    next(err)
})

app.use(function(err, req, res, next) {
    console.log('afa')
    //set locals, only providing error in dev
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'developement' ? err : {}
    //render the error page
    res.status(err.status || 500)
    res.render('error')
})

var port=4003
app.set('port',port)

//create a http server
var server = http.createServer(app)

server.listen(port, () => {
    console.log('Listening')
})
