var mongoQueries = class MongoQueries {
  constructor(db){
    this.db = db;
  }
  createCollection(collectionName, callback){
    this.db.db('simpleChatbot').createCollection(collectionName, function(err, res) {
      if (err) throw err;
      callback(res, err);
    });
  }
  insertMany(collectionName, obj, callback){
    this.db.db("simpleChatbot").collection(collectionName).insertMany(obj, function(err, res) {
      if (err) throw err;
      callback({res:"OK"}, obj);
    });
  }
  insertOne(collectionName, obj, callback){
    this.db.db("simpleChatbot").collection(collectionName).insertOne(obj, function(err, res) {
      if (err) throw err;
      callback({res:"OK"}, obj);
    });
  }
  find(collectionName, callback){
    this.db.db("simpleChatbot").collection(collectionName).find({}).toArray(function(err, res) {
     if (err) throw err;
      callback(res);
    });
  }
  findWithLimit(collectionName, callback){
    this.db.db("simpleChatbot").collection(collectionName).find({}).limit(10).toArray(function(err, res) {
     if (err) throw err;
      callback(res);
    });
  }
  findByQuery(collectionName, query, callback){
    this.db.db("simpleChatbot").collection(collectionName).find(query).toArray(function(err, res) {
     if (err) throw err;
      callback(res);
    });
  }
  deleteCollection(collectionName){
      this.db.db("simpleChatbot").collection(collectionName).drop();
  }
  deleteOne(collectionName, query, callback){
    this.db.db("simpleChatbot").collection(collectionName).deleteOne(query, function(err, obj) {
    if (err) throw err;
      callback(obj);
    });
  }
  update(collectionName, query, newValues, callback){
    this.db.db("simpleChatbot").collection(collectionName).update(query, newValues, function(err, res) {
     if (err) throw err;
      callback(res);
    });
  }
}

module.exports = mongoQueries;
