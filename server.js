'use strict';

var express = require('express');
var mongo = require('mongodb');
var validUrl = require("valid-url");
var shortId = require("shortid");
var env = require('dotenv').config({
  silent: true
});
var test = require('assert');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 5000;
var mongUser = process.env.MUSER;
var mongPass = process.env.MPASS;

const MongoClient = mongo.MongoClient;
const uri = `mongodb+srv://${mongUser}:${mongPass}@clusterbuster-ylads.mongodb.net/test?retryWrites=true`;
const client = new MongoClient(uri, {useNewUrlParser: true});

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api/', express.static('public'));
app.get('/api/shorturl/new/:url(*)', function(req, res){
  var url = req.params.url;
  if(validUrl.isHttpUri(url)){

    MongoClient.connect(uri, {useNewUrlParser: true}, (err, db) => {
      if(err){
        res.end(`error test : user is ${mongUser}`);
        return console.log(err);
      }else{
        var urlList = db.db("test").collection('URLs');
      
        var short = shortId.generate();
            urlList.insertOne({url: url, short: short}, function(err, r) {
              test.equal(null, err);
              test.equal(1, r.insertedCount);
            // Finish up test
            db.close();
          });
            var data = {
              original_url: url, 
              short_url: 'http://'+req.headers['host']+'/'+short
            };
            res.send(data);
      }
    });
  } else {
    var data = {
      error: "invalid URL"
    }
    res.json(data);
  }
});
app.post('/api/shorturl/new', function (req, res){
  var url = req.body.url;

  if(validUrl.isHttpUri(url) || validUrl.isHttpsUri(url)){
  
    MongoClient.connect(uri, {useNewUrlParser: true}, (err, db) => {
      if(err){
        res.end(`error test : user is ${mongUser}`);
        return console.log(err);
      }else{
        var urlList = db.db("test").collection('URLs');
      
        var short = shortId.generate();
            urlList.insertOne({url: url, short: short}, function(err, r) {
              test.equal(null, err);
              test.equal(1, r.insertedCount);
            // Finish up test
            db.close();
          });
            var data = {
              original_url: url, 
              short_url: 'http://'+req.headers['host']+'/'+short
            };
            
            res.send(data);

      }
    });
  } else {
    
    var data = {
      error: "invalid URL"
    }
    res.json(data);
  }

});
app.get('/:id', function(req, res){
  var id = req.params.id;
  MongoClient.connect(uri, {useNewUrlParser: true}, (err, db) => {
    if(err){
      return console.log(err);
    }else {
      var urlList = db.db("test").collection('URLs');
      urlList.find({short:id}).toArray(function(err, docs){
        if(err){
          res.end('error has occured')
          return console.log('read', err);
        }else{
          if(docs.length > 0){
            db.close();
            res.redirect(docs[0].url);
          }else{
            db.close();
            res.end("error");
          }
        }
      })
    }
  })
});


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});