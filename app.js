var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);
var port=8080;




var ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
bruteforce = new ExpressBrute(store,{
    freeRetries: 50,
    lifetime: 3600
});

var indexRouter = require('./routes/index');
app.use(express.static(__dirname));
app.use(bodyParser());
app.use('/', indexRouter);

app.all('*', function(req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

console.log("Listening at "+port)
server.listen(port);
