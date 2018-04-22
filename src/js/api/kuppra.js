

//
"use strict";

var cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;

//const routes = require('./routes');

//console.log(googleBooks);

const app = express();
app.use(cors()); //enables on all rpoutes
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello');
});

app.get('/search', function(req, res) {
    var profile = [
        req.body.nombre,
        req.body.apellido,
        req.body.sexo,
        req.body.bday,
        req.body.plan,
        req.body.residencia,
        req.body.deducible,
        req.body.suma,
        req.body.unico,
        req.body.coaseguro,
        req.body.gura,
        req.body.frecuencia,
        req.body.preferencia
    ];
    var oneLineProfile = profile.join(';');
    setTimeout(function(){
        res.send({type:'get',nombre: req.body.nombre, apellido: req.body.apellido, arr: profile, one: oneLineProfile});
    }, 5000);
    
});

app.post('/search', function(req, res) {
    var profile = [
        req.body.nombre,
        req.body.apellido,
        req.body.sexo,
        req.body.bday,
        req.body.plan,
        req.body.residencia,
        req.body.deducible,
        req.body.suma,
        req.body.unico,
        req.body.coaseguro,
        req.body.gura,
        req.body.frecuencia,
        req.body.preferencia
    ];
    var oneLineProfile = profile.join(';');
    setTimeout(function(){
        res.send({type:'post',nombre: req.body.nombre, apellido: req.body.apellido, arr: profile, one: oneLineProfile});
    }, 5000);
    
});

app.post('/', function(req, res){
    var profile = [
        req.body.nombre,
        req.body.apellido,
        req.body.sexo,
        req.body.bday,
        req.body.plan,
        req.body.residencia,
        req.body.deducible,
        req.body.suma,
        req.body.unico,
        req.body.coaseguro,
        req.body.gura,
        req.body.frecuencia,
        req.body.preferencia
    ];
    var oneLineProfile = profile.join(';');
    res.send({nombre: req.body.nombre, apellido: req.body.apellido, arr: profile, one: oneLineProfile});
});

app.post('/create', function(req, res) {
    //
    var profile = [
        req.body.nombre,
        req.body.apellido,
        req.body.sexo,
        req.body.bday,
        req.body.plan,
        req.body.residencia,
        req.body.deducible,
        req.body.suma,
        req.body.unico,
        req.body.coaseguro,
        req.body.gura,
        req.body.frecuencia,
        req.body.preferencia
    ];
    var oneLineProfile = profile.join(';');
    var childArgs = [
        path.join(__dirname, '/../../templates/kupprabot.js'),
        //'Prueba;Php;0;11/11/1996;060001001214;17;5000;300000;1;15 - $70,000.00;25;4;1'
        oneLineProfile
    ];
    
    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
        res.send({
            response:err,
            stdout: stdout,
            stderr: stderr
        });
    });
});

app.get('/browse', function(req, res) {
    //
})

const port = process.env.port || 3000;

app.listen(port, ()=> {
    console.log('Starting web server', port);
});