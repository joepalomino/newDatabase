


var koa = require('koa');

//middleware and helpers
var serve = require('koa-static');
var parse = require('co-body');
var router = require('koa-router');
var http = require('http');
var logger = require('koa-logger');


//import rethinkdb
var r = require('rethinkdb');

//load config for rethinkdb and koa
var config = require(__dirname+"/config.js");

var app = koa();

var api = router();

app.use(logger());



//static content
app.use(serve(__dirname+'/public'));

//create a rethinkdb connection
app.use(createConnection);

api.get('/toptimes',byTopTimes());
api.get('/swimmer',bySwimmer());
api.get('/meet',byMeet());

app.use(api.routes())
   .use(api.allowedMethods());



//close rethinkd connection
app.use(closeConnection());


//create a rethinkdb connection
function* createConnection(next) {
  try {
    var conn = yield r.connect(config.rethinkdb);
    this._rdbConn = conn;
  }catch(err){
    this.status = 500;
    this.body = err.message || http.STATUS_CODES[this.status];
  }
  yield next
}

function byTopTimes() {
  return function *(next) {
    var q = this.request.query;
    var cursor = yield r.table('swim').orderBy(r.row('entryTime')).filter(
      r.row('gender').upcase().eq(q.gender.toUpperCase())
      .and(r.row('ageGroup').upcase().eq(q.agegroup.toUpperCase()))
      .and(r.row('stroke').upcase().eq(q.stroke.toUpperCase()))
      .and(r.row('distance').eq(q.dist))
      .and(r.row('team').upcase.eq(q.team.toUpperCase()))
      ).run(this._rdbConn);
    var result = yield cursor.toArray();
    this.body = JSON.stringify(result);
    yield next;
  }
}

function bySwimmer() {
  return function *(next) {

    var qs = this.request.querystring;
    var q = this.request.query;

    //pulls data from the db
    var cursor = yield r.table('swim').filter(function(swim) {

      //if there is no query it will return all data else returns only the data specified by the query
      if(qs == "") {
        return swim.hasFields("fullName");
      } else {
        return swim('fullName').upcase().eq(q.fullname.toUpperCase());
      }

    }).run(this._rdbConn);
    var result = yield cursor.toArray();
    this.body = JSON.stringify(result);

  yield next
  }
}

function byMeet () {
  return function *(next) {
    var qs = this.request.querystring;
    var q = this.request.query;

    var cursor = yield r.table('swim').filter(function(swimmer) {
      if(qs == '') {
        return swimmer.pluck('meet');
      } else {
        return swimmer('meet').upcase().eq(q.meet.toUpperCase())
      }
    }).run(this._rdbConn);
    var result = yield cursor.toArray();
    this.body = JSON.stringify(result);

    yield next;
  }
}



function closeConnection() {
  return function *(next) {
    this._rdbConn.close();
  }
}

r.connect(config.rethinkdb, function(err,conn) {
  if(err) {
    console.log("Could not open connection to intitalize the db");
    console.log(err);
    process.exit(1);
  }

  r.table('swim').indexWait().run(conn).then(function(err,result) {
    console.log("databse is ready, starting koa........");
    startKoa();
  });
});

function startKoa() {
  app.listen(config.koa.port);
  console.log("listening on port : " + config.koa.port);
}
