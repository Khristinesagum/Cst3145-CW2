// Import dependencies modules:
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const req = require('express/lib/request');
const res = require('express/lib/response');
// Create an Express.js instance:
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));

// config Express.js
app.use(express.json())
app.set('port', 3000)
app.use ((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://KhristineSGM:Lordgabayanniyoako@cluster0.fc1um.mongodb.net/test', (err, client) => {
    db = client.db('School_ClassesActivities')
})

// dispaly a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages')
})
// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
})
// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

//adding post
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
    if (e) return next(e)
    res.send(results.ops)
    })
    })

const ObjectID = require('mongodb').ObjectID;
//Updating number of space
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
    {_id: new ObjectID(req.params.id)},
    {$set: req.body},
    {safe: true, multi: false},
    (e, result) => {
    if (e) return next(e)
    res.send((result.modifiedCount === 1) ? {msg: 'success'} : {msg: 'error'})
    })
})

app.get('/collection/Lesson Information', (req, res, next) => {
    req.collection.find({}).toArray((e, lessonsinfo) => {
        if (e) return next(e)
        res.send(lessonsinfo)
    })
})
app.post('/post-order', function (req, res) {
    db.then(function(dbs) {
        delete req.body._id; // for safety reasons
        dbs.collection('Order Information').insertOne(req.body);
    });    
    res.send('Data received:\n' + JSON.stringify(req.body));
});

const port = process.env.PORT || 3000
app.listen(port)

