// Import dependencies modules:
const express = require('express')
// Create an Express.js instance:
const app = express()
var fs = require("fs");
var path = require("path");

// Logger middleware
app.use(function(req,res,next){
    console.log("Request IP: " + req.url);
    console.log("Request date:" + new Date());
    next();
});
// The static file server middleware
app.use(function(req, res, next){
    var filepath = path.join(__dirname,"static",req.url);
    fs.stat(filepath, function(err, fileInfo){
        if(err){
            next();
            return;
        }
        if(fileInfo.isFile()){
            res.sendFile(filepath);
        } else {
            next();
        }
    });
});
// Incase of any error
app.use (function(req,res){
    res.status(404);
    res.send("file not found!");
});

app.listen(3000, function(){
    console.log("App started on port 3000");
});

