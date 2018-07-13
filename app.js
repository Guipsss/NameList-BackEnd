const express = require('express');
const app = express();
app.use(express.json());
var ObjectId = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://userPT3:KE23VFhk4SweJsAV@mongodb/sampledb';
 
// Database Name
const dbName = 'myproject';

let data;

const findDocuments = function(db, callback) {
    const collection = db.collection('documents');
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        data = docs;
        callback(docs);
    });
}

let insData;
const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertOne(insData, function(err, result) {
      assert.equal(err, null);
      console.log("Name inserted");
      callback(result);
    });
}

let id;
const removeDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    collection.deleteOne({ _id : id }, function(err, result) {
        assert.equal(err, null);
        console.log("Removed a document");
        callback(result);
    });    
}

let newName;
const updateDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ _id : id }
        , { $set: { name : newName } }, function(err, result) {
        console.log("Updated a document");
        callback(result);
    });  
}

//app.get('/', (req, res) => res.send('Hello World!'));

app.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://guipsss.github.io');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
    
        const db = client.db(dbName);

        findDocuments(db, function() {
            res.send(data);
            client.close();
        });
    });
});

app.post('/insert', (req, res) => {
    insData = { name : req.body.name};
    
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
    
        const db = client.db(dbName);

        insertDocuments(db, function(){
            res.send({ status : 'Success'});
            client.close();
        });
    });
});

app.delete('/delete', (req, res) => {
    id = ObjectId(req.body._id);

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
    
        const db = client.db(dbName);

        removeDocument(db, function(){
            res.send({ status : 'Success'});
            client.close();
        });
    });
});

app.put('/update', (req, res) => {
    id = ObjectId(req.body._id);
    newName = req.body.name;
    console.log(req.body);

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
    
        const db = client.db(dbName);

        updateDocument(db, function(){
            res.send({ status : 'Success'});
            client.close();
        });
    });
});

app.listen(3000, () => console.log('Listening on Port 3000'));