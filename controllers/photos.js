const express = require('express');
const FileUploader = require('./../services/file_upload');
const mongoose = require('mongoose');
const models = require('./../models');
const h = require('./../helpers');

const User = mongoose.model('User');
const Photo = mongoose.model('Photo');
const router = express.Router();

// Index
router.get('/', (req, res) => {
  Photo.find()
    .populate('user')
    .sort([['createdAt', 'ASC']])
    .then(photos => {
      res.render('photos/index', { user: req.user, photos });
    });
});

// New
router.get('/new', (req, res) => {
  res.render('photos/new', { user: req.user });
});

// Show
router.get('/:id', (req, res, next) => {
  Photo.findById(req.params.id)
    .populate('user')
    .then(photo => {
      res.render('photos/show', { user: req.user, photo });
    })
    .catch(next);
});

// Create
const mw = FileUploader.single('photo[file]');

router.post('/', mw, (req, res, next) => {
  FileUploader.upload({
    data: req.file.buffer,
    name: req.file.originalname,
    mimetype: req.file.mimetype
  })
    .then(data => {
      const photo = new Photo({
        user: req.user.id,
        name: data.name,
        url: data.url,
        description: req.body.photo.description || ''
      });

      return photo.save();
    })
    .then(photo => {
      return User.findByIdAndUpdate(req.user.id, {
        $push: { photos: photo }
      });
    })
    .then(() => {
      req.flash('success', 'Photo uploaded!');
      res.redirect(h.photosPath());
    })
    .catch(next);
});

// Destroy
router.delete('/:id', (req, res, next) => {
  let photo;

  Photo.findOne({ name: req.params.id })
    .then(result => {
      photo = result;
      return FileUploader.remove(req.params.id);
    })
    .then(() => {
      return User.findByIdAndUpdate(req.user.id, {
        $pull: { photos: photo.id }
      });
    })
    .then(() => {
      return Photo.findByIdAndRemove(photo.id);
    })
    .then(() => {
      res.redirect(h.photosPath());
    })
    .catch(next);
});

module.exports = router;
