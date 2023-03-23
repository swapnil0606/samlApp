var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var { SAML } = require('node-saml');
const AWS = require('aws-sdk');
// console.log(SAML);
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

/**
 * private.pem - Used to encrypt SAML Request & decrypt SAML Response.
 * public.pem - Given to IDP (OneLogin) to decrypt SAML Request & encrypt SAML Response.
 */


console.log("commit 1")

const check = fs.readFileSync('certs/public.pem', 'utf-8');
const check1 = fs.readFileSync('certs/private.pem', 'utf-8');

console.log("check:", check);

const saml = new SAML({
  callbackUrl: 'https://development.api.verifiedfirst.com/v3/callback/saml-endpoint',
  entryPoint: 'https://verifiedfirst-dev.onelogin.com/trust/saml2/http-post/sso/55fa8120-c4df-4266-a337-0968eafd6cec',
  decryptionPvk: check1,  // Decrypt SAML Response (response from OneLogin)
  privateCert: check1, // Encrypt SAML Request (sent to OneLogin)
})

console.log("saml: ", saml);

const app = express();
console.log("commit 2")
var port = 8082;

app.use(express.urlencoded({ extended: false }))

app.get('/login/saml', async (request, response, next) => {
  const URL = await saml.getAuthorizeUrl();
  console.log("URL :", URL);
  response.redirect(URL)
})

app.post('/login/saml/callback', async (request, response, next) => {
  const { profile } = await saml.validatePostResponse(request.body);
  response.send(`Hello ${profile.nameID}!`);
})
console.log("commit 3")
// app.listen(3000)

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;