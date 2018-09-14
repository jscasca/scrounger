//
"use strict";

const express = require('express');
const https = require('https');
const cors = require('cors');
const bodyParser = require('body-parser');

const googleBooks = require('../processors/googlebooks')();
const config = require('../config');
const sibmailer = require('../mailers/SendinblueMailer');
//const routes = require('./routes');

const app = express();
app.use(cors()); //enables on all rpoutes
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

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
app.get('/scrounger/availability', function(req, res) {
  res.send('Up');
});

// app.get('/search/:search', function(req, res) {
//     //
//     var gbooks = googleBooks.getSearchResults(req.params.search); //returns a promise
//     console.log(gbooks);
//     //req.url
//     //params {search: search}
//     //query {} whatever is after the ?
//     res.send();
// });

// app.get('/browse', function(req, res) {
//     //
// });

app.get('/kuppra/cotiza', function(req, res) {
    // Validate data
  var edad = req.body.edad;
  var ahorro = req.body.ahorro;
  var fuma = req.body.fuma;
  if(cotizadorVida.valida(edad, ahorro, fuma)) {
    res.send(cotizadorVida.cotiza(parseInt(edad), parseInt(ahorro), fuma));
  } else {
    res.status(400);
    res.send('Invalid data');
  }
});

app.post('/process/reset', function(req, res) {
  var email = req.body.email;
  var token = req.body.token;
  var key = req.body.key;
  if(key === config.mailer) {
    var mailer = sibmailer.createMailer(config.sendinblue);
    // TODO: make content with the token
    var htmlContent = [
      "<p>We received a request to reset your password on this account.</p>",
      "<p>If this was not you, please ignore this email.</p>",
      "<p>To reset your password, click on the following link <a href='http://prologes.com/reset?token=" + token + "'>http://prologes.com/reset?token=" + token + "</a> or copy the address and enter it in your web browser.</p>"
    ].join("\n");
    var sendmail = mailer.sendTransactionalMail(email, "Reset your password", htmlContent);
    sendmail.then(function(r) {
      // TODO: log success
    }, function(err) {
      console.log('Reset Error: ' + err.message);
    });
  }
  res.send();
});

const redirectUnmatched = function(req, res) {
  res.redirect("http://prologes.com");
};
app.use(redirectUnmatched);

const port = process.env.port || 3000;

app.listen(port, ()=> {
  console.log('Starting web server', port);
});