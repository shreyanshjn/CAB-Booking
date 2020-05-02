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
var debug = require('debug')('mean-app:server');

// mongoose.Promise = require('bluebird')
const uri = process.env.URI
mongoose.set('useCreateIndex', true) // To remove this warning. DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose
    // .connect(uri, {promiseLibrary: require('bluebird'), useNewUrlParser: true, useUnifiedTopology: true  })
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false   })
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


var port
if (process.env.REACT_APP_SERVER_ENVIORNMENT === "dev") {
  port = normalizePort(process.env.REACT_APP_SERVER_PORT || '3000');
} else {
  port = normalizePort(process.env.PORT || '3000');
}
app.set('port', port);


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

//create a http server
var server = http.createServer(app)


server.listen(port, () => {
    console.log('Listening')
})
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
