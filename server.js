var path = require('path')
var express = require('express')
var session = require('express-session')
var favicon = require('serve-favicon')
var nunjucks = require('nunjucks')
var dateFilter = require('nunjucks-date-filter')
var request = require('request')
var bodyParser = require('body-parser')
var utils = require('./lib/utils.js')
var config = require('./app/config.js')


// Add in versions variable here - and make sure you jump down to the app.use as well
var index = require('./app/routes/index');

var expl_v1 = require('./app/routes/expl_v1');
var expl_v2 = require('./app/routes/expl_v2');
var expl_v2_1 = require('./app/routes/expl_v2_1');
var expl_v3 = require('./app/routes/expl_v3');
var expl_v4 = require('./app/routes/expl_v4');

var MVP_v1 = require('./app/routes/MVP_v1');


var app = express()

// Grab environment variables specified in Procfile or as Heroku config vars
//var username = process.env.USERNAME
//var password = process.env.PASSWORD
var appEnvironment = process.env.NODE_ENV || 'development'
var useAuth = process.env.USE_AUTH || config.useAuth
var useHttps = process.env.USE_HTTPS || config.useHttps

appEnvironment = appEnvironment.toLowerCase()
useAuth = useAuth.toLowerCase()
useHttps = useHttps.toLowerCase()

// Authenticate against the environment-provided credentials, if running
// the app in production (Heroku, effectively)
//if (appEnvironment === 'production' && useAuth === 'true') {
//  app.use(utils.basicAuth(username, password))
//}

// Add variables that are available in all views
app.use(function (req, res, next) {
  res.locals.serviceName = config.serviceName
  res.locals.practiceName = config.practiceName
  res.locals.practiceAddress = config.practiceAddress
  res.locals.practiceTelephoneNumber = config.practiceTelephoneNumber
  res.locals.practicePostcode = config.practicePostcode
  res.locals.practiceOnlineAppointmentsLink = config.practiceOnlineAppointmentsLink
  res.locals.cookieText = config.cookieText
  res.locals.regwithGPURL = config.regwithGPURL
  next()
})

// Support session data
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: Math.round(Math.random() * 100000).toString()
}))

/*var myLogger = function (req, res, next) {
  console.log(req.session);
  next();
};
app.use(myLogger);*/

// Handle form POSTS
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Middleware to serve static assets
app.use('/', express.static(path.join(__dirname, '/public')))

// Application settings
app.set('view engine', 'html')

var env = nunjucks.configure('./app/views', {
    autoescape: true,
    express: app,
    noCache: true
});
env.addFilter('date', dateFilter);

// app.use - need to make sure you add in the version route here as well, yo
app.use('/', index);
app.use('/expl_v1', expl_v1);
app.use('/expl_v2', expl_v2);
app.use('/expl_v2_1', expl_v2_1);
app.use('/expl_v3', expl_v3);


// auto render any view that exists
app.get(/^\/([^.]+)$/, function (req, res) {
  var path = (req.params[0])

  res.render(path, function (err, html) {
    if (err) {
      res.render(path + '/index', function (err2, html) {
        if (err2) {
          console.log(err)
          res.status(404).send(err + '<br>' + err2)
        } else {
          res.end(html)
        }
      })
    } else {
      res.end(html)
    }
  })
});

// Force HTTPs on production connections
if (appEnvironment === 'production' && useHttps === 'true') {
  app.use(utils.forceHttps)
}

// Disallow search index
app.use(function (req, res, next) {
  // Setting headers stops pages being indexed even if indexed pages link to them.
  res.setHeader('X-Robots-Tag', 'noindex')
  next()
})

app.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})

// start the app
utils.findAvailablePort(app, function (port) {
  console.log('Listening on port ' + port + '   url: http://localhost:' + port)
  app.listen(port)
})
