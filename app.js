const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use((req, res, next) => {
  res.locals.siteTitle = 'Node S3 Photo Gallery';
  next();
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const cookieSession = require('cookie-session');

app.use(
  cookieSession({
    name: 'session',
    keys: ['asdf1234567890qwer']
  })
);

app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});

const flash = require('express-flash-messages');
app.use(flash());

const methodOverride = require('method-override');
const getPostSupport = require('express-method-override-get-post-support');

app.use(
  methodOverride(
    getPostSupport.callback,
    getPostSupport.options // { methods: ['POST', 'GET'] }
  )
);

app.use((req, res, next) => {
  req.session.backUrl = req.header('Referer') || '/';
  next();
});

// app.use(express.static(`${__dirname}/public`));

// Logging
const morgan = require('morgan');
const highlight = require('cli-highlight').highlight;

// Add :data format token
// to `tiny` format
let format = [
  ':separator',
  ':newline',
  ':method ',
  ':url ',
  ':status ',
  ':res[content-length] ',
  '- :response-time ms',
  ':newline',
  ':newline',
  ':data',
  ':newline',
  ':separator',
  ':newline',
  ':newline'
].join('');

// Use morgan middleware with custom format
app.use(morgan(format));

// Helper tokens
morgan.token('separator', () => '****');
morgan.token('newline', () => '\n');

// Set data token to output req query params and body
morgan.token('data', (req, res, next) => {
  let data = [];
  ['query', 'params', 'body', 'session'].forEach(key => {
    if (req[key]) {
      let capKey = key[0].toUpperCase() + key.substr(1);
      let value = JSON.stringify(req[key], null, 2);
      data.push(`${capKey}: ${value}`);
    }
  });
  data = highlight(data.join('\n'), {
    language: 'json',
    ignoreIllegals: true
  });
  return `${data}`;
});

// Routes
const photosRouter = require('./controllers/photos');

app.use('/', photosRouter);

// Template engine
const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  partialsDir: 'views/',
  defaultLayout: 'application',
  helpers: helpers
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Server
const port = process.env.PORT || process.argv[2] || 3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

app.listen.apply(app, args);

// Error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render('errors/500', { error: err });
});

module.exports = app;
