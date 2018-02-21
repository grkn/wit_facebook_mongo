var express = require('express');
var app = express();
var cors = require('cors');
var mongo = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var FaceBookClass = require('./facebook/facebook');
var MongoQueries = require('./mongo/mongoQueries');

var Client = require('node-rest-client').Client;

const queryString = require('query-string');
var client = new Client();

var url = "mongodb://localhost:27017/simpleChatbot";
let instanceMongoQueries;

let global = { }

mongo.connect(url, function(err, db) {
  if (err) throw err;
  instanceMongoQueries = new MongoQueries(db);
  instanceMongoQueries.find("configuration", function(resp){
    console.log("configuration- "+resp);
    if(resp && resp.length > 0){
      global = resp[0];
    }else{
      global = {
        threshold : 0.6,
        responseList : ['Anlayamadım', 'Aradığınızı bulamadım', 'Öğrenmek üzereyim', 'Tekrar ifade eder misiniz?']
      }
      instanceMongoQueries.insertOne("configuration", global, function(resp){});
    }

    var facebookDeployment = {
      pageId : "1657653330994017"
      ,appId : "164676360822932"
      ,appSecret : "3852884e6f04de03bfbaf79757811b40"
      ,accessToken : "EAACVxbP9YJQBAJtZCZAqbrBG9ZBTmZAPgtsaLFP3DZCi5qJ5sXboxQxoy9iE7gcRpJ8Nr3XbvBYJFLZCvbcQgPr3fX2vSIhRRrXmRONubZCUj6Iri61liP0KEcstJoNru0eTXyL4qYO9nybMFmpEC0QQQmXZA4bzBG1rZAUKdSH8kwgZDZD"
      ,verifyToken : "secretkey"}

    var facebookClass = new FaceBookClass(
      facebookDeployment.pageId,
      facebookDeployment.appId,
      facebookDeployment.appSecret,
      facebookDeployment.accessToken,
      facebookDeployment.verifyToken,global,instanceMongoQueries);
    facebookClass.botListen();
  })
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});





app.get("/mongo/createCollection/:collectionName", function(req, res){
  instanceMongoQueries.createCollection(req.params.collectionName, function(resp,err){
    res.send({resp : 'OK'});
  });
});

app.post("/mongo/insert/:collectionName", function(req, res){
  if(req.body.obj && Array.isArray(req.body.obj)){
      instanceMongoQueries.insertMany(req.params.collectionName, req.body.obj, function(resp, obj){
        res.send(resp);
      });
  }
  if(req.body.obj && !Array.isArray(req.body.obj)){
    instanceMongoQueries.insertOne(req.params.collectionName, req.body.obj, function(resp, obj){
      res.send(resp);
    });
  }
});

app.get("/mongo/find/:collectionName", function(req, res){
  instanceMongoQueries.find(req.params.collectionName, function(result){
    res.send(result);
  });
});

app.get("/mongo/findByLimitTen/:collectionName", function(req, res){
  instanceMongoQueries.findWithLimit(req.params.collectionName, function(result){
    res.send(result);
  });
});

app.post("/mongo/findByQuery/:collectionName", function(req, res){
  instanceMongoQueries.findByQuery(req.params.collectionName, req.body.query, function(result){
    res.send(result);
  });
});

app.get("/mongo/delete/:collectionName", function(req, res){
  instanceMongoQueries.deleteCollection(req.params.collectionName);
  res.send({resp : "OK"});
});

app.get("/mongo/deleteOne/:collectionName", function(req, res){
  instanceMongoQueries.deleteOne(req.params.collectionName, req.body.query, function(result){
    res.send(result);
  });
});

app.get("/mongo/update/:collectionName", function(req, res){
  instanceMongoQueries.update(req.params.collectionName, req.body.query, newValues, function(result){
    res.send(result);
  });
});

app.listen(7001);
