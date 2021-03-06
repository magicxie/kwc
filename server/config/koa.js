'use strict';

var fs = require('fs'),
    logger = require('koa-logger'),
    send = require('koa-send'),
    jwt = require('koa-jwt'),
    livereload = require('koa-livereload'),
    config = require('./config');

module.exports = function (app) {
  // middleware configuration
  if (config.app.env !== 'test') {
    app.use(logger());
  }
  if (config.app.env === 'development') {
    app.use(livereload({excludes: ['/modules']}));
  }

  // register special controllers which should come before any jwt token check and be publicly accessible
  require('../controllers/public').init(app);
  require('../controllers/signin').init(app);
  require('../controllers/wechat').init(app);

  // serve the angular static files from the /client directory
  var sendOpts = {root: 'client', maxage: config.app.cacheTime};
  app.use(function *(next) {
    // skip any route that starts with /api as it doesn't have any static files
    console.log(this.ip, this.path);
    if (this.path.substr(0, 5).toLowerCase() === '/api/') {
      yield next;
      return;
    }

    // if the requested path matched a file and it is served successfully, exit the middleware
    if (yield send(this, this.path, sendOpts)) {
      return;
    }

    //if(this.path === '/'){
        yield send(this, '/index.html', sendOpts);
        return;
    //}

    // if given path didn't match any file, just let angular handle the routing
    // return this.throw('-_-|||', 404);
  });

  // middleware below this line is only reached if jwt token is valid
  app.use(jwt({secret: config.app.secret}));

  // mount all the routes defined in the api controllers
  fs.readdirSync('./server/controllers').forEach(function (file) {
     console.log('init controllers' , file);
      try{
          require('../controllers/' + file).init(app);
      }catch(e){
          console.error(e);
      }

  });
};