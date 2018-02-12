//
"use strict";

const express = require('express');
const https = require('https');

const googleBooks = require('../processors/googlebooks')();
//const routes = require('./routes');

console.log(googleBooks);

const app = express();
/*
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept');
    if(req.method === 'Options') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});*/
/*
app.use(logger('dev'));
app.use(jsonParser());
app.use('/search', routes);
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
        message: err.message
        }
    });
});*/
app.get('/', function(req, res) {
    res.send('Hello');
});

app.get('/search/:search', function(req, res) {
    //
    console.log(req);
    //req.url
    //params {search: search}
    //query {} whatever is after the ?
    res.send();
});

app.get('/browse', function(req, res) {
    //
})

const port = process.env.port || 3000;

app.listen(port, ()=> {
    console.log('Starting web server', port);
});