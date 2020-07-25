var fs = require('fs');
const express = require('express');
var cors = require('cors');
var https = require('https');
// var http = require('http');

const fileRouter = require('./routes/fileData');

const app = express()

app.use(cors());


var certificate = fs.readFileSync('/home/fbx/ssl/certs/fbxchange_com_eb92e_31055_1596508146_26aa38629333f1a4ceb57fb1ca683686.crt',{encoding:'utf8'},function(err, data ) {
    console.log( data );});
var privateKey  = fs.readFileSync('/home/fbx/ssl/keys/eb92e_31055_9f88be1458ac039958b1e077583b5da7.key',{encoding:'utf8'},function(err, data ) {
    console.log( data );});
  

var credentials = {
    key: privateKey,
    cert: certificate,
    rejectUnauthorized:false
  };

  //comment here

var httpsServer = https.createServer(credentials, app);


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

// app.get('/test', async(req,res) => {
//     res.send(JSON.stringify({"found":"Get"}));
//     return;
// });

httpsServer.listen(7090, function() {
  console.log('HTTPS server listening on port 7040');
});
