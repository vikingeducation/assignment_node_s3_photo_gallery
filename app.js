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

// Mongoose
const mongoose = require('mongoose');

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')().then(() => next());
  }
});

// Services
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models').User;

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    function(email, password, done) {
      User.findOne({ email }, function(err, user) {
        if (err) return done(err);
        if (!user || !user.validatePassword(password)) {
          return done(null, false, { message: 'Invalid email/password' });
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(e => done(null, false));
});

// Session helper middleware
const loggedInOnly = (req, res, next) => {
  return req.user ? next() : res.redirect('/login');
};

const loggedOutOnly = (req, res, next) => {
  return !req.user ? next() : res.redirect('/');
};

// Routes
app.get('/login', loggedOutOnly, (req, res) => {
  res.render('sessions/new');
});

const onLogout = (req, res) => {
  req.logout();
  req.method = 'GET';
  res.redirect('/login');
};

app.get('/logout', loggedInOnly, onLogout);
app.delete('/logout', loggedInOnly, onLogout);

app.post(
  '/sessions',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

const usersRouter = require('./controllers/users')({
  loggedInOnly,
  loggedOutOnly
});
const photosRouter = require('./controllers/photos');

app.use('/users', usersRouter);
app.use('/photos', photosRouter);
app.use('/', (req, res) => {
  if (req.user) {
    res.redirect('/photos');
  } else {
    res.redirect('/login');
  }
});

// Server
const port = process.env.PORT || process.argv[2] || 3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
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
