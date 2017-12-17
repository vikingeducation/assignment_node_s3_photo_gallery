const express = require('express');
const router = express.Router();
const User = require('../models').User;
const { loggedOutOnly, loggedInOnly } = require('../services/session');

router.get('/', loggedInOnly, (req, res) => {
  User.find()
    .then(users => {
      res.render('users/index', { users });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.get('/new', loggedOutOnly, (req, res) => {
  res.render('users/new');
});

router.get('/:id', loggedInOnly, (req, res) => {
  User.findById(req.params.id)
    .populate('photos')
    .then(user => {
      if (!user) throw 'No User';
      res.render('users/show', { user });
    })
    .catch(e => res.status(500).send(e));
});

router.post('/', loggedOutOnly, (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const newUser = new User({ firstName, lastName, email, password });

  newUser.save()
    .then(() => {
      req.login(newUser, err => {
        if (err) throw err;
        res.redirect('/photos');
      });
    })
    .catch(e => {
      if (e.message) {
        req.flash('error', e.message);
        res.redirect('/users/new');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;
