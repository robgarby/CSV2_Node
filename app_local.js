var fs = require('fs');
const express = require('express');
var cors = require('cors');
var https = require('https');
var http = require('http');

const fileRouter = require('./routes/fileData');

const app = express()

app.use(cors());

var httpServer = http.createServer(app);

app.use((req,res,next)=>{
    next();
})

app.use(express.json());

app.use((req, res, next)  =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(fileRouter);

httpServer.listen(8020, function() {
    console.log('HTTP server listening Local on port 8020');
});
